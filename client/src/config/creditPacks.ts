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
    price: 1000,
    priceDisplay: '$10',
    perCreditCost: 0.20,
    popular: false,
    savings: '0%',
    description: 'Perfect for trying out the platform',
  },
  {
    id: 'creator',
    name: 'Creator Pack',
    credits: 330,
    price: 2500,
    priceDisplay: '$25',
    perCreditCost: 0.08,
    popular: true,
    savings: '60%',
    description: 'Best value for regular creators',
  },
  {
    id: 'professional',
    name: 'Professional Pack',
    credits: 1500,
    price: 8000,
    priceDisplay: '$80',
    perCreditCost: 0.05,
    popular: false,
    savings: '75%',
    description: 'For power users and professionals',
  },
];
