import { api } from '../api-client';

interface CheckoutSessionResponse {
  success: boolean;
  data: { url: string };
  error?: string;
}

interface BillingPortalResponse {
  success: boolean;
  data: { url: string };
  error?: string;
}

export const billingApi = {
  createCheckoutSession: (packId: string) =>
    api.post<CheckoutSessionResponse>('/api/billing/create-checkout-session', { packId }),

  createPortalSession: () =>
    api.post<BillingPortalResponse>('/api/billing/create-portal-session'),
};
