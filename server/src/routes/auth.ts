import { Router } from "express";
import { authenticateUser, AuthRequest } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import supabaseAdmin from "../supabase/client";
import { updateProfileSchema } from "../types/validation";

const router = Router();

router.get('/me', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found',
      });
    }

    res.json({
      success: true,
      user: profile,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.patch(
  '/me',
  authenticateUser,
  validateBody(updateProfileSchema),
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const { full_name, avatar_url } = req.body;

      const updates: any = {
        updated_at: new Date().toISOString(),
      };

      if (full_name !== undefined) updates.full_name = full_name;
      if (avatar_url !== undefined) updates.avatar_url = avatar_url;

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        user: data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

export default router;