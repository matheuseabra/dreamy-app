export const CREDIT_PACKS = {
  starter: {
    id: 'starter',
    name: 'Starter Pack',
    credits: 50,
    price: 999, // $9.99 in cents
    priceDisplay: '$9.99',
    perCreditCost: 0.20,
    popular: false,
    savings: '0%',
    description: 'Perfect for trying out the platform',
  },
  creator: {
    id: 'creator',
    name: 'Creator Pack',
    credits: 150,
    price: 2999, // $29.99 in cents
    priceDisplay: '$29.99',
    perCreditCost: 0.16,
    popular: true,
    savings: '20%',
    description: 'Best value for regular creators',
  },
  professional: {
    id: 'professional',
    name: 'Professional Pack',
    credits: 750,
    price: 9999, // $99.99 in cents
    priceDisplay: '$99.99',
    perCreditCost: 0.13,
    popular: false,
    savings: '35%',
    description: 'For power users and professionals',
  }
} as const;

export type CreditPackId = keyof typeof CREDIT_PACKS;
