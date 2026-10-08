export interface CheckoutResponseDTO {
  purchaseId: number;
  sessionId: string;
  gateway: string;
  amountCents: number;
  trackTitle: string;
  redirectUrl: string | null;
}

export type PurchaseStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface PurchaseResponseDTO {
  purchaseId: number;
  sessionId: string;
  status: PurchaseStatus;
  amountCents: number;
  trackTitle: string;
  confirmedAt: string | null;
}