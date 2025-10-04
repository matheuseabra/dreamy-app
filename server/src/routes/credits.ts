import { Router } from 'express';
import { authenticateUser, AuthRequest } from '../middleware/auth';
import { CreditService } from '../services/credit-service';

const router = Router();
const creditService = new CreditService();

router.get('/', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const credits = await creditService.getUserCredits(userId);

    res.json({
      success: true,
      credits: {
        remaining: credits.credits_remaining,
        total: credits.credits_total,
        lastRefill: credits.last_refill_date,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;