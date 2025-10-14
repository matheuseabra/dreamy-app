import supabaseAdmin from '../supabase/client';

export class ProfileService {
  /**
   * Create or update a profile entry when a user signs up.
   * Accepts the user object coming from Supabase auth webhook.
   */
  async createProfileOnSignup(user: any) {
    if (!user || !user.id) {
      throw new Error('Invalid user payload');
    }

    const id = user.id;
  const email: string = user.email ?? '';

    const full_name = (user.user_metadata && user.user_metadata.full_name) || null;
  const avatar_url = (user.user_metadata && user.user_metadata.avatar_url) || null;

    const now = new Date().toISOString();

    const payload: any = {
      id,
      email,
      full_name,
      avatar_url,
      updated_at: now,
      created_at: now,
    };

    // Use upsert so this is idempotent if called multiple times
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async getProfile(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }
}
