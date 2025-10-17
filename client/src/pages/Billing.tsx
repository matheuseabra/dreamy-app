 // client/src/pages/Billing.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { Loader2, Check, Star, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { CREDIT_PACKS } from '@/config/creditPacks';
import { useCreateCheckoutSession, useCredits } from '@/hooks/api';

export default function Billing() {
  const createCheckoutSession = useCreateCheckoutSession();
  const [loadingPack, setLoadingPack] = useState<string | null>(null);

  const {
    data: creditsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useCredits();

  const handleBuyCredits = (packId: string) => {
    setLoadingPack(packId);
    createCheckoutSession.mutate(packId, {
      onError: (error: any) => {
        toast.error(error.message || 'Failed to start checkout');
        setLoadingPack(null);
      },
      // onSuccess automatically redirects via the hook
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Billing & Credits!!!</h1>
            <p className="text-muted-foreground">
              Purchase credits to generate more amazing images
            </p>
          </div>
          <div className="text-center space-y-6">
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message || "Failed to load credits. Please try again."}
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
        <div className="container max-w-6xl mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Billing & Credits</h1>
            <p className="text-muted-foreground">
              Purchase credits to generate more amazing images
            </p>
          </div>

          {/* Loading skeleton for credits card */}
          <Card className="mb-8 border border-accent">
            <CardHeader>
              <CardTitle>Current Balance</CardTitle>
              <CardDescription>Your available credits</CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-32 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>

          {/* Loading skeletons for credit packs */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Buy Credits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border border-accent">
                  <CardHeader>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-12 w-24" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const credits = creditsData?.credits;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Billing & Credits</h1>
        <p className="text-muted-foreground">
          Purchase credits to generate more amazing images
        </p>
      </div>

      {isFetching && !isLoading && (
        <div className="fixed top-4 right-4 z-50">
          <Alert className="w-auto">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <AlertDescription>Refreshing credits...</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Current Credits Card */}
      <Card className="mb-8 border border-accent">
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
          <CardDescription>Your available credits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold">
                {credits?.remaining || 0}
              </div>
              <p className="text-sm text-muted-foreground">
                Credits remaining
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Packs */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Buy Credits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CREDIT_PACKS.map((pack) => (
            <Card
              key={pack.id}
              className={`border border-accent relative ${
                pack.popular ? 'shadow-lg md:scale-105 ring-2 ring-primary' : ''
              }`}
            >
              {pack.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}

              <CardHeader>
                <CardTitle>{pack.name}</CardTitle>
                <CardDescription className="text-xs">
                  {pack.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <div className="text-3xl font-bold">{pack.priceDisplay}</div>
                  <p className="text-sm text-muted-foreground">
                    {pack.credits} credits
                  </p>
                  {pack.savings !== '0%' && (
                    <Badge variant="secondary" className="mt-2">
                      Save {pack.savings}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>${pack.perCreditCost.toFixed(2)} per credit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Never expires</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>All AI models</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleBuyCredits(pack.id)}
                  disabled={loadingPack === pack.id}
                  variant={pack.popular ? 'default' : 'outline'}
                >
                  {loadingPack === pack.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Buy Now'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
