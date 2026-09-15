export interface MyRatingDTO {
  enrolled: boolean;
  completionPercentage: number;
  canRate: boolean;
  stars: number | null;
  comment: string | null;
}