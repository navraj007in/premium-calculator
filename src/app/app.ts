import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OCCUPATIONS, Occupation, getOccupationByValue, getFactorForRating } from './models/occupation.model';
import { dateOfBirthValidator, ageValidator, currencyValidator } from './validators/custom.validators';
import { PremiumCalculatorService, PremiumCalculationResult } from './services/premium-calculator.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  premiumForm: FormGroup;
  monthlyPremium: number = 0;
  occupations = OCCUPATIONS;
  selectedOccupationDetails: Occupation | undefined;
  formSubmitted = false;
  calculationResult: PremiumCalculationResult | null = null;
  showCalculationDetails = false;
  premiumUpdated = false;

  constructor(
    private fb: FormBuilder,
    private premiumCalculatorService: PremiumCalculatorService
  ) {
    this.premiumForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      ageNextBirthday: ['', [Validators.required, ageValidator()]],
      dateOfBirth: ['', [Validators.required, dateOfBirthValidator()]],
      occupation: ['', Validators.required],
      deathSumInsured: ['', [Validators.required, currencyValidator()]]
    });

    // Subscribe to form changes to trigger calculation
    this.premiumForm.valueChanges.subscribe(() => {
      this.calculatePremium();
    });

    // Subscribe specifically to occupation changes for immediate feedback
    this.premiumForm.get('occupation')?.valueChanges.subscribe(value => {
      this.selectedOccupationDetails = getOccupationByValue(value);
      // Immediately trigger calculation when occupation changes
      if (value && this.premiumForm.valid) {
        this.calculatePremium();
      }
    });
  }

  getOccupationRating(): string {
    return this.selectedOccupationDetails ? this.selectedOccupationDetails.rating : '';
  }

  getOccupationFactor(): number {
    return this.selectedOccupationDetails ? getFactorForRating(this.selectedOccupationDetails.rating) : 0;
  }

  calculatePremium(): void {
    if (this.premiumForm.valid) {
      const formValue = this.premiumForm.value;
      const previousPremium = this.monthlyPremium;

      this.calculationResult = this.premiumCalculatorService.calculatePremium({
        name: formValue.name,
        ageNextBirthday: formValue.ageNextBirthday,
        dateOfBirth: formValue.dateOfBirth,
        occupation: formValue.occupation,
        deathSumInsured: formValue.deathSumInsured
      });

      this.monthlyPremium = this.calculationResult ? this.calculationResult.monthlyPremium : 0;

      // Show update animation if premium changed
      if (previousPremium !== this.monthlyPremium && this.monthlyPremium > 0) {
        this.premiumUpdated = true;
        setTimeout(() => {
          this.premiumUpdated = false;
        }, 1000);
      }
    } else {
      this.calculationResult = null;
      this.monthlyPremium = 0;
      this.premiumUpdated = false;
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.premiumForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.formSubmitted));
  }

  getFieldError(fieldName: string, errorType: string): boolean {
    const field = this.premiumForm.get(fieldName);
    return !!(field && field.errors && field.errors[errorType]);
  }

  toggleCalculationDetails(): void {
    this.showCalculationDetails = !this.showCalculationDetails;
  }

  formatCurrency(amount: number): string {
    return this.premiumCalculatorService.formatCurrency(amount);
  }
}
