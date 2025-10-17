import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, User, Mail, Calendar } from 'lucide-react';
import { useProfile } from '@/hooks/api';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: profile,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useProfile(id || '');

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">User Profile</h1>
            <p className="text-muted-foreground">
              View user information
            </p>
          </div>
          <div className="text-center space-y-6">
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message || "Failed to load profile. Please try again."}
              </AlertDescription>
            </Alert>
            <Button onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
              />
              {isFetching ? "Retrying..." : "Try Again"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">User Profile</h1>
            <p className="text-muted-foreground">
              View user information
            </p>
          </div>

          <Card className="border border-accent">
            <CardHeader>
              <div className="flex items-center gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">User Profile</h1>
            <p className="text-muted-foreground">
              View user information
            </p>
          </div>
          <Alert className="max-w-md mx-auto">
            <User className="h-4 w-4" />
            <AlertDescription>Profile not found.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Profile</h1>
          <p className="text-muted-foreground">
            View user information
          </p>
        </div>

        {isFetching && !isLoading && (
          <div className="fixed top-4 right-4 z-50">
            <Alert className="w-auto">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <AlertDescription>Refreshing profile...</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Profile Header Card */}
        <Card className="border border-accent mb-6">
          <CardHeader>
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={profile.avatar_url || undefined}
                  alt={profile.full_name || profile.email}
                />
                <AvatarFallback className="text-2xl">
                  {profile.full_name?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {profile.full_name || 'No name set'}
                </h2>
                <p className="text-muted-foreground mt-1">{profile.email}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Details Card */}
        <Card className="border border-accent">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>User account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 py-3 border-b">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Full Name</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {profile.full_name || 'Not provided'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 py-3 border-b">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {profile.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 py-3 border-b">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 py-3">
              <RefreshCw className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {profile.updated_at
                    ? new Date(profile.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
