import { TestBed } from '@angular/core/testing';
import { PremiumCalculatorService, PremiumCalculationInput } from './premium-calculator.service';

describe('PremiumCalculatorService', () => {
  let service: PremiumCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PremiumCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculatePremium', () => {
    it('should calculate premium correctly for a doctor', () => {
      const input: PremiumCalculationInput = {
        name: 'John Doe',
        ageNextBirthday: 30,
        dateOfBirth: '01/1994',
        occupation: 'doctor',
        deathSumInsured: 100000
      };

      const result = service.calculatePremium(input);

      expect(result).toBeTruthy();
      expect(result?.occupationRating).toBe('Professional');
      expect(result?.occupationFactor).toBe(1.5);

      // Formula: (100000 * 1.5 * 30) / (1000 * 12) = 375 monthly
      expect(result?.monthlyPremium).toBe(375);
      expect(result?.annualPremium).toBe(4500);
    });

    it('should calculate premium correctly for a mechanic', () => {
      const input: PremiumCalculationInput = {
        name: 'Jane Smith',
        ageNextBirthday: 45,
        dateOfBirth: '06/1979',
        occupation: 'mechanic',
        deathSumInsured: 250000
      };

      const result = service.calculatePremium(input);

      expect(result).toBeTruthy();
      expect(result?.occupationRating).toBe('Heavy Manual');
      expect(result?.occupationFactor).toBe(31.75);

      // Formula: (250000 * 31.75 * 45) / (1000 * 12) = 29765.63 monthly
      expect(result?.monthlyPremium).toBe(29765.63);
      expect(result?.annualPremium).toBe(357187.5);
    });

    it('should calculate premium correctly for an author', () => {
      const input: PremiumCalculationInput = {
        name: 'Bob Wilson',
        ageNextBirthday: 25,
        dateOfBirth: '12/1999',
        occupation: 'author',
        deathSumInsured: 50000
      };

      const result = service.calculatePremium(input);

      expect(result).toBeTruthy();
      expect(result?.occupationRating).toBe('White Collar');
      expect(result?.occupationFactor).toBe(2.25);

      // Formula: (50000 * 2.25 * 25) / (1000 * 12) = 234.38 monthly
      expect(result?.monthlyPremium).toBe(234.38);
      expect(result?.annualPremium).toBe(2812.5);
    });

    it('should return null for invalid input', () => {
      const invalidInput: PremiumCalculationInput = {
        name: '',
        ageNextBirthday: 0,
        dateOfBirth: '',
        occupation: '',
        deathSumInsured: 0
      };

      const result = service.calculatePremium(invalidInput);
      expect(result).toBeNull();
    });

    it('should return null for invalid occupation', () => {
      const input: PremiumCalculationInput = {
        name: 'Test User',
        ageNextBirthday: 30,
        dateOfBirth: '01/1994',
        occupation: 'invalid_occupation',
        deathSumInsured: 100000
      };

      const result = service.calculatePremium(input);
      expect(result).toBeNull();
    });

    it('should validate age boundaries', () => {
      const inputTooYoung: PremiumCalculationInput = {
        name: 'Test User',
        ageNextBirthday: 0,
        dateOfBirth: '01/2024',
        occupation: 'doctor',
        deathSumInsured: 100000
      };

      const inputTooOld: PremiumCalculationInput = {
        name: 'Test User',
        ageNextBirthday: 101,
        dateOfBirth: '01/1923',
        occupation: 'doctor',
        deathSumInsured: 100000
      };

      expect(service.calculatePremium(inputTooYoung)).toBeNull();
      expect(service.calculatePremium(inputTooOld)).toBeNull();
    });

    it('should validate sum insured boundaries', () => {
      const inputNegative: PremiumCalculationInput = {
        name: 'Test User',
        ageNextBirthday: 30,
        dateOfBirth: '01/1994',
        occupation: 'doctor',
        deathSumInsured: -1000
      };

      const inputTooHigh: PremiumCalculationInput = {
        name: 'Test User',
        ageNextBirthday: 30,
        dateOfBirth: '01/1994',
        occupation: 'doctor',
        deathSumInsured: 10000001
      };

      expect(service.calculatePremium(inputNegative)).toBeNull();
      expect(service.calculatePremium(inputTooHigh)).toBeNull();
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(service.formatCurrency(1000)).toBe('$1,000.00');
      expect(service.formatCurrency(1234.56)).toBe('$1,234.56');
      expect(service.formatCurrency(0)).toBe('$0.00');
    });
  });
});