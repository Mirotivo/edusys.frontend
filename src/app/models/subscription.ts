import { User } from "./user";

export enum BillingFrequency {
  Monthly = 'Monthly',
  Yearly = 'Yearly'
}

export enum SubscriptionStatus {
  Active = 'Active',
  Expired = 'Expired',
  Cancelled = 'Cancelled'
}

export interface Subscription {
  id: number;
  userId: string;
  user?: User | null;
  startDate: string; // ISO string (e.g., "2024-02-27T10:30:00Z")
  nextBillingDate: string; // ISO string for scheduled charge
  cancellationDate?: string | null; // Nullable
  amount: number; // Decimal is handled as number in TS
  billingFrequency: BillingFrequency;
  status: SubscriptionStatus; // Computed field
}
