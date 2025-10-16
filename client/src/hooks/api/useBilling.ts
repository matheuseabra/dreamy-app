import { useMutation } from '@tanstack/react-query';
import { billingApi } from '@/lib/api/billing';

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: (packId: string) => billingApi.createCheckoutSession(packId),
    onSuccess: (response) => {
      if (response.success && response.data.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      }
    },
    onError: (error) => {
      console.error('Failed to create checkout session:', error);
    },
  });
}
