
import { stripe, STRIPE_PRICE_IDS } from '../stripe/client';
import { CREDIT_PACKS, getCreditPack } from '../config/credit-packs';
import { createError } from '../middleware/error-handler';
import supabaseAdmin from '../supabase/client';

export class BillingService {
  /**
   * Create or retrieve Stripe customer for user
   */
  async getOrCreateStripeCustomer(
    userId: string,
    email: string
  ): Promise<string> {
    // Check if user already has a Stripe customer ID
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id, full_name')
      .eq('id', userId)
      .single();

    if (profile?.stripe_customer_id) {
      return profile.stripe_customer_id;
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email,
      name: profile?.full_name || undefined,
      metadata: {
        supabase_user_id: userId,
      },
    });

    // Save customer ID to profile
    await supabaseAdmin
      .from('profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('id', userId);

    return customer.id;
  }

  /**
   * Create Checkout Session for credit purchase
   */
  async createCheckoutSession(
    userId: string,
    email: string,
    packId: string
  ) {
    const pack = getCreditPack(packId);
    const priceId = STRIPE_PRICE_IDS[packId];

    if (!priceId) {
      throw createError(`No Stripe price configured for pack: ${packId}`, 400);
    }

    const customerId = await this.getOrCreateStripeCustomer(userId, email);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/account/billing?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/account/billing?canceled=true`,
      metadata: {
        user_id: userId,
        pack_id: packId,
        credits: pack.credits.toString(),
      },
      client_reference_id: userId,
    });

    // Create pending transaction record
    await supabaseAdmin.from('credit_transactions').insert({
      user_id: userId,
      credits_amount: pack.credits,
      transaction_type: 'purchase',
      pack_id: packId,
      amount_paid: pack.price,
      stripe_checkout_session_id: session.id,
      stripe_customer_id: customerId,
      status: 'pending',
      description: `Purchase of ${pack.name}`,
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  /**
   * Process successful payment (called from webhook)
   */
  async processSuccessfulPayment(sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    const userId = session.metadata?.user_id;
    const packId = session.metadata?.pack_id;
    const credits = parseInt(session.metadata?.credits || '0');

    if (!userId || !packId || !credits) {
      throw createError('Invalid session metadata', 400);
    }

    // Check if already processed (idempotency)
    const { data: existingTransaction } = await supabaseAdmin
      .from('credit_transactions')
      .select('id, status')
      .eq('stripe_checkout_session_id', sessionId)
      .eq('status', 'completed')
      .single();

    if (existingTransaction) {
      console.log(`Payment already processed: ${sessionId}`);
      return;
    }

    // Add credits to user account
    const { data: currentCredits } = await supabaseAdmin
      .from('user_credits')
      .select('credits_remaining, credits_total')
      .eq('user_id', userId)
      .single();

    if (!currentCredits) {
      // Create credits record if doesn't exist
      await supabaseAdmin.from('user_credits').insert({
        user_id: userId,
        credits_remaining: credits,
        credits_total: credits,
      });
    } else {
      // Update existing credits
      await supabaseAdmin
        .from('user_credits')
        .update({
          credits_remaining: currentCredits.credits_remaining + credits,
          credits_total: currentCredits.credits_total + credits,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    }

    // Update transaction record
    await supabaseAdmin
      .from('credit_transactions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        stripe_payment_intent_id:
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id,
      })
      .eq('stripe_checkout_session_id', sessionId);

    console.log(
      `Successfully added ${credits} credits to user ${userId} from session ${sessionId}`
    );
  }
}
