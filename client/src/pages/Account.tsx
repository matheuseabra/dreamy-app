import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { getMyProfile, Profile, updateMyProfile } from '../lib/api';

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyProfile().then((data) => {
      setProfile(data);
      setFullName(data?.full_name || '');
      setAvatarUrl(data?.avatar_url || '');
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await updateMyProfile({ full_name: fullName, avatar_url: avatarUrl });
      setProfile(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!profile) return <div className="p-8">Profile not found.</div>;

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="max-w-md w-full p-8 flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || profile.email} />
          <AvatarFallback>{profile.full_name?.[0] || profile.email[0]}</AvatarFallback>
        </Avatar>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSave}>
          <label className="font-semibold">Full Name</label>
          <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" />
          <label className="font-semibold">Avatar URL</label>
          <Input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="Avatar image URL" />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
        </form>
      </Card>
    </div>
  );
}
