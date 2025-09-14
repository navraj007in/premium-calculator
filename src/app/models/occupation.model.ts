export interface Occupation {
  name: string;
  value: string;
  rating: OccupationRating;
}

export enum OccupationRating {
  Professional = 'Professional',
  WhiteCollar = 'White Collar',
  LightManual = 'Light Manual',
  HeavyManual = 'Heavy Manual'
}

export interface RatingFactor {
  rating: OccupationRating;
  factor: number;
}

export const OCCUPATIONS: Occupation[] = [
  { name: 'Cleaner', value: 'cleaner', rating: OccupationRating.LightManual },
  { name: 'Doctor', value: 'doctor', rating: OccupationRating.Professional },
  { name: 'Author', value: 'author', rating: OccupationRating.WhiteCollar },
  { name: 'Farmer', value: 'farmer', rating: OccupationRating.HeavyManual },
  { name: 'Mechanic', value: 'mechanic', rating: OccupationRating.HeavyManual },
  { name: 'Florist', value: 'florist', rating: OccupationRating.LightManual },
  { name: 'Other', value: 'other', rating: OccupationRating.HeavyManual }
];

export const RATING_FACTORS: RatingFactor[] = [
  { rating: OccupationRating.Professional, factor: 1.5 },
  { rating: OccupationRating.WhiteCollar, factor: 2.25 },
  { rating: OccupationRating.LightManual, factor: 11.50 },
  { rating: OccupationRating.HeavyManual, factor: 31.75 }
];

export function getFactorForRating(rating: OccupationRating): number {
  const ratingFactor = RATING_FACTORS.find(rf => rf.rating === rating);
  return ratingFactor ? ratingFactor.factor : 1;
}

export function getOccupationByValue(value: string): Occupation | undefined {
  return OCCUPATIONS.find(occ => occ.value === value);
}