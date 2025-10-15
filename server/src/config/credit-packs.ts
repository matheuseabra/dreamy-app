// server/src/config/credit-packs.ts
export const CREDIT_PACKS = {
  starter: {
    id: 'starter',
    credits: 50,
    price: 999,
    name: 'Starter Pack',
  },
  creator: {
    id: 'creator',
    credits: 250,
    price: 3999,
    name: 'Creator Pack',
  },
  professional: {
    id: 'professional',
    credits: 750,
    price: 9999,
    name: 'Professional Pack',
  }
} as const;

export type CreditPackId = keyof typeof CREDIT_PACKS;

export function getCreditPack(packId: string) {
  const pack = CREDIT_PACKS[packId as CreditPackId];
  if (!pack) {
    throw new Error(`Invalid pack ID: ${packId}`);
  }
  return pack;
}
