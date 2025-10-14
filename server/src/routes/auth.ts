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

    // If profile not found, create a minimal one so clients always have a profile row.
    if (error || !profile) {
      const email: string = req.user!.email ?? '';
      const username = email ? email.split('@')[0] : '';
      const now = new Date().toISOString();

      const { data: newProfile, error: insertError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          email: email,
          full_name: null,
          avatar_url: null,
          created_at: now,
          updated_at: now,
        }, { onConflict: 'id' })
        .select()
        .single();

      if (insertError) {
        return res.status(500).json({ success: false, error: insertError.message });
      }

      return res.json({ success: true, user: newProfile });
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