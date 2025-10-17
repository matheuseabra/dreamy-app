import { api } from '../api-client';

interface CheckoutSessionResponse {
  success: boolean;
  data: { url: string };
  error?: string;
}

interface CreditsResponse {
  success: boolean;
  credits: {
    remaining: number;
    total: number;
    lastRefill: string;
  };
  error?: string;
}

export const billingApi = {
  createCheckoutSession: (packId: string) =>
    api.post<CheckoutSessionResponse>('/api/billing/create-checkout-session', { packId }),

  getCredits: () =>
    api.get<CreditsResponse>('/api/credits'),
};
