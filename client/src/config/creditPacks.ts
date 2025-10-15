export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  priceDisplay: string;
  perCreditCost: number;
  popular: boolean;
  savings: string;
  description: string;
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 50,
    price: 999,
    priceDisplay: '$9.99',
    perCreditCost: 0.20,
    popular: false,
    savings: '0%',
    description: 'Perfect for trying out the platform',
  },
  {
    id: 'creator',
    name: 'Creator Pack',
    credits: 250,
    price: 3999,
    priceDisplay: '$39.99',
    perCreditCost: 0.16,
    popular: true,
    savings: '20%',
    description: 'Best value for regular creators',
  },
  {
    id: 'professional',
    name: 'Professional Pack',
    credits: 750,
    price: 9999,
    priceDisplay: '$99.99',
    perCreditCost: 0.13,
    popular: false,
    savings: '35%',
    description: 'For power users and professionals',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pack',
    credits: 2500,
    price: 24999,
    priceDisplay: '$249.99',
    perCreditCost: 0.10,
    popular: false,
    savings: '50%',
    description: 'Maximum value for teams',
  },
];
