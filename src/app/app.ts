import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  premiumForm: FormGroup;
  monthlyPremium: number = 0;

  constructor(private fb: FormBuilder) {
    this.premiumForm = this.fb.group({
      name: ['', Validators.required],
      ageNextBirthday: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      dateOfBirth: ['', Validators.required],
      occupation: ['', Validators.required],
      deathSumInsured: ['', [Validators.required, Validators.min(1)]]
    });
  }
}
