// client/src/pages/Billing.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Loader2, Check, Star, History } from 'lucide-react';
import { toast } from 'sonner';
import { CREDIT_PACKS } from '@/config/creditPacks';
import { useCreateCheckoutSession } from '@/hooks/api/useBilling';

export default function Billing() {
  const createCheckoutSession = useCreateCheckoutSession();
  const [loadingPack, setLoadingPack] = useState<string | null>(null);

  const { data: credits } = useQuery({
    queryKey: ['credits'],
    queryFn: () => fetch('/api/credits').then(r => r.json()),
  });

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



  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Billing & Credits</h1>
        <p className="text-muted-foreground">
          Purchase credits to generate more amazing images
        </p>
      </div>

      {/* Current Credits Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
          <CardDescription>Your available credits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold">
                {credits?.credits?.remaining || 0}
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
              className={`relative ${
                pack.popular ? 'ring-2 ring-primary' : ''
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

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Transaction History
          </CardTitle>
          <CardDescription>Your recent credit purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Transaction history coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
