# Premium Calculator

Angular application for calculating monthly life insurance premiums based on occupation, age, and sum insured.

## Quick Start

```bash
npm install
ng serve
```

Navigate to `http://localhost:4200/`

## Features

- Form validation for all required fields
- Real-time premium calculation
- Occupation-based rating system
- Responsive design with animations

## Formula

Monthly Premium = (Death Cover × Occupation Factor × Age) ÷ (1000 × 12)

## Occupation Ratings

| Occupation | Rating | Factor |
|------------|--------|--------|
| Doctor | Professional | 1.5 |
| Author | White Collar | 2.25 |
| Cleaner, Florist | Light Manual | 11.50 |
| Farmer, Mechanic, Other | Heavy Manual | 31.75 |

## Testing

```bash
ng test
```

## Assumptions

- Date format: MM/YYYY
- Age range: 1-100 years
- Sum insured: $1 - $10,000,000
- Premium calculation triggers on occupation change when form is valid