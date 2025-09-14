import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateOfBirthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value;
    const regex = /^(0[1-9]|1[0-2])\/\d{4}$/;

    if (!regex.test(value)) {
      return { invalidDateFormat: true };
    }

    const [month, year] = value.split('/');
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 100;

    if (monthNum < 1 || monthNum > 12) {
      return { invalidMonth: true };
    }

    if (yearNum < minYear || yearNum > currentYear) {
      return { invalidYear: { min: minYear, max: currentYear } };
    }

    return null;
  };
}

export function ageValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const age = control.value;
    if (age < 1) {
      return { tooYoung: true };
    }
    if (age > 100) {
      return { tooOld: true };
    }

    return null;
  };
}

export function currencyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value;
    if (value <= 0) {
      return { invalidAmount: true };
    }

    if (value > 10000000) {
      return { amountTooHigh: true };
    }

    return null;
  };
}