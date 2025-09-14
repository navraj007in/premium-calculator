import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OCCUPATIONS, Occupation, getOccupationByValue, getFactorForRating } from './models/occupation.model';
import { dateOfBirthValidator, ageValidator, currencyValidator } from './validators/custom.validators';

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

  constructor(private fb: FormBuilder) {
    this.premiumForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      ageNextBirthday: ['', [Validators.required, ageValidator()]],
      dateOfBirth: ['', [Validators.required, dateOfBirthValidator()]],
      occupation: ['', Validators.required],
      deathSumInsured: ['', [Validators.required, currencyValidator()]]
    });

    this.premiumForm.get('occupation')?.valueChanges.subscribe(value => {
      this.selectedOccupationDetails = getOccupationByValue(value);
    });
  }

  getOccupationRating(): string {
    return this.selectedOccupationDetails ? this.selectedOccupationDetails.rating : '';
  }

  getOccupationFactor(): number {
    return this.selectedOccupationDetails ? getFactorForRating(this.selectedOccupationDetails.rating) : 0;
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
}
