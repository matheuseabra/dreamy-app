import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Card } from '../components/ui/card';
import { getProfile, Profile } from '../lib/api';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getProfile(id).then(setProfile).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!profile) return <div className="p-8">Profile not found.</div>;

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="max-w-md w-full p-8 flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || profile.email} />
          <AvatarFallback>{profile.full_name?.[0] || profile.email[0]}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{profile.full_name || 'No name set'}</h2>
        <p className="text-gray-500">{profile.email}</p>
      </Card>
    </div>
  );
}
