import { createError } from "../middleware/error-handler";
import supabaseAdmin from "../supabase/client";

export class CreditService {
  async getUserCredits(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw createError('Failed to fetch user credits', 500);
    }

    if (!data) {
      const { data: newCredits, error: createError } = await supabaseAdmin
        .from('user_credits')
        .insert({
          user_id: userId,
          credits_remaining: 10,
          credits_total: 10,
        })
        .select()
        .single();

      if (createError) throw createError;
      return newCredits;
    }

    return data;
  }

  async checkCredits(userId: string, required: number = 1): Promise<boolean> {
    const credits = await this.getUserCredits(userId);
    return credits.credits_remaining >= required;
  }

  async deductCredits(userId: string, amount: number = 1) {
    const credits = await this.getUserCredits(userId);

    if (credits.credits_remaining < amount) {
      throw createError('Insufficient credits', 402);
    }

    const { error } = await supabaseAdmin
      .from('user_credits')
      .update({
        credits_remaining: credits.credits_remaining - amount,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw createError('Failed to deduct credits', 500);

    return credits.credits_remaining - amount;
  }

  async refundCredits(userId: string, amount: number) {
    const credits = await this.getUserCredits(userId);

    const { error } = await supabaseAdmin
      .from('user_credits')
      .update({
        credits_remaining: credits.credits_remaining + amount,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw createError('Failed to refund credits', 500);

    return credits.credits_remaining + amount;
  }
}