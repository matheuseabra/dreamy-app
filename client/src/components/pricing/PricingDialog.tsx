import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CREDIT_PACKS } from "@/config/creditPacks";
import { useCreateCheckoutSession, useCredits } from "@/hooks/api";
import { AlertCircle, Check, Loader2, RefreshCw, Star } from "lucide-react";

export interface PricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiredCredits?: number; // optionally display how many credits are needed for the attempted action
  title?: string;
  description?: string;
}

export default function PricingDialog({
  open,
  onOpenChange,
  requiredCredits,
  title,
  description,
}: PricingDialogProps) {
  const { data: creditsData, isLoading, error, refetch, isFetching } = useCredits();
  const createCheckoutSession = useCreateCheckoutSession();
  const [loadingPack, setLoadingPack] = useState<string | null>(null);

  const currentCredits = creditsData?.credits?.remaining ?? 0;

  const missingCredits = useMemo(() => {
    if (!requiredCredits) return 0;
    return Math.max(0, requiredCredits - currentCredits);
  }, [requiredCredits, currentCredits]);

  const handleBuyCredits = (packId: string) => {
    setLoadingPack(packId);
    createCheckoutSession.mutate(packId, {
      onError: () => {
        setLoadingPack(null);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border border-none">
        <DialogHeader>
          <DialogTitle>{title || "You’re out of credits"}</DialogTitle>
          <DialogDescription>
            {description ||
              "Purchase a credit pack to continue generating images and videos."}
          </DialogDescription>
        </DialogHeader>

        {/* Error state */}
        {error ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message || "Failed to load your credits. Please try again."}
              </AlertDescription>
            </Alert>
            <Button onClick={() => refetch()} disabled={isFetching} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
              {isFetching ? "Retrying..." : "Try again"}
            </Button>
          </div>
        ) : null}

        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CREDIT_PACKS.map((pack) => (
              <Card
                key={pack.id}
                className={`relative border border-accent ${
                  pack.popular ? "ring-2 ring-primary" : ""
                }`}
              >
                {pack.popular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}

                <CardHeader>
                  <CardTitle className="text-base">{pack.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {pack.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold">{pack.priceDisplay}</div>
                    <p className="text-sm text-muted-foreground">
                      {pack.credits} credits
                    </p>
                    {pack.savings !== "0%" && (
                      <Badge variant="secondary" className="mt-2">
                        Save {pack.savings}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1 text-sm">
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
                      <span>Works with all AI models</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleBuyCredits(pack.id)}
                    disabled={loadingPack === pack.id}
                    variant={pack.popular ? "default" : "outline"}
                  >
                    {loadingPack === pack.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      "Buy Now"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            Questions about billing?{" "}
            <Link to="/contact" className="underline">
              Contact support
            </Link>
          </span>
          <Button asChild variant="ghost" size="sm">
            <Link to="/billing">Go to Billing</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
