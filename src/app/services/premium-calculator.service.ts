import { Injectable } from '@angular/core';
import { getOccupationByValue, getFactorForRating } from '../models/occupation.model';

export interface PremiumCalculationInput {
  name: string;
  ageNextBirthday: number;
  dateOfBirth: string;
  occupation: string;
  deathSumInsured: number;
}

export interface PremiumCalculationResult {
  monthlyPremium: number;
  annualPremium: number;
  occupationRating: string;
  occupationFactor: number;
  calculationDetails: {
    deathCoverAmount: number;
    age: number;
    factor: number;
    formula: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PremiumCalculatorService {

  constructor() { }

  /**
   * Calculates the monthly premium based on the formula:
   * Death Premium = (Death Cover amount * Occupation Rating Factor * Age) / 1000 * 12
   */
  calculatePremium(input: PremiumCalculationInput): PremiumCalculationResult | null {
    // Validate input
    if (!this.validateInput(input)) {
      return null;
    }

    // Get occupation details
    const occupation = getOccupationByValue(input.occupation);
    if (!occupation) {
      return null;
    }

    // Get factor for occupation rating
    const factor = getFactorForRating(occupation.rating);

    // Calculate monthly premium using the formula
    // Death Premium = (Death Cover amount * Occupation Rating Factor * Age) / 1000 * 12
    // Interpreting this as monthly premium calculation
    const monthlyPremium = (input.deathSumInsured * factor * input.ageNextBirthday) / (1000 * 12);

    // Calculate annual premium
    const annualPremium = monthlyPremium * 12;

    return {
      monthlyPremium: this.roundToTwoDecimals(monthlyPremium),
      annualPremium: this.roundToTwoDecimals(annualPremium),
      occupationRating: occupation.rating,
      occupationFactor: factor,
      calculationDetails: {
        deathCoverAmount: input.deathSumInsured,
        age: input.ageNextBirthday,
        factor: factor,
        formula: `($${input.deathSumInsured} × ${factor} × ${input.ageNextBirthday}) ÷ 1000 × 12 = $${this.roundToTwoDecimals(annualPremium)}/year`
      }
    };
  }

  /**
   * Validates that all required input fields are present and valid
   */
  private validateInput(input: PremiumCalculationInput): boolean {
    if (!input.name || input.name.trim().length < 2) {
      return false;
    }

    if (!input.ageNextBirthday || input.ageNextBirthday < 1 || input.ageNextBirthday > 100) {
      return false;
    }

    if (!input.dateOfBirth || !this.isValidDateFormat(input.dateOfBirth)) {
      return false;
    }

    if (!input.occupation) {
      return false;
    }

    if (!input.deathSumInsured || input.deathSumInsured <= 0 || input.deathSumInsured > 10000000) {
      return false;
    }

    return true;
  }

  /**
   * Validates date format MM/YYYY
   */
  private isValidDateFormat(date: string): boolean {
    const regex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(date);
  }

  /**
   * Rounds a number to 2 decimal places
   */
  private roundToTwoDecimals(num: number): number {
    return Math.round(num * 100) / 100;
  }

  /**
   * Formats currency for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
}