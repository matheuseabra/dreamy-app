// server/src/routes/billing.ts
import { Router } from 'express';
import { authenticateUser, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { BillingService } from '../services/billing-service';
import { createCheckoutSessionSchema } from '../types/validation';

const router = Router();
const billingService = new BillingService();

// Create Checkout Session
router.post(
  '/create-checkout-session',
  authenticateUser,
  validateBody(createCheckoutSessionSchema),
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const email = req.user!.email;
      const { packId } = req.body;

      const session = await billingService.createCheckoutSession(
        userId,
        email,
        packId
      );

      res.json({
        success: true,
        data: session,
      });
    } catch (error: any) {
      console.error('Checkout session creation error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create checkout session',
      });
    }
  }
);

export default router;
