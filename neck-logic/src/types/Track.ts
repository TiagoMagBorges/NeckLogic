export interface TrackDTO {
  id: number;
  title: string;
  description: string | null;
  ownerName: string;
  official: boolean;
  published: boolean;
  paid: boolean;
  priceCents: number | null;
  enrolled: boolean;
}