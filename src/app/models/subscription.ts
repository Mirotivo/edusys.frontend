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
  startDate: Date;
  nextBillingDate: Date;
  cancellationDate?: Date | null;
  amount: number; // Decimal is handled as number in TS
  billingFrequency: BillingFrequency;
  status: SubscriptionStatus; // Computed field
}
