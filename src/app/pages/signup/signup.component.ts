import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ValidatorService } from '../../validators/password-validator.service';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  signupError = '';
  referralToken: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Initialize the form
    this.signupForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email],
      ],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        ValidatorService.hasNonAlphanumeric(),
        ValidatorService.hasLowercase(),
        ValidatorService.hasUppercase(),
      ]],
      verifyPassword: ['', [
        Validators.required,
        ValidatorService.matchesPassword('password')
      ]],
    });

    // Listen to query parameters
    this.route.queryParams.subscribe((params) => {
      this.referralToken = params['referral'] || null;
    });
  }

  // Handle form submission
  async onSignup(): Promise<void> {
    if (this.signupForm.invalid) {
      return;
    }

    try {
      const errorMessage = await this.authService.register(
        this.signupForm.value.email,
        this.signupForm.value.password,
        this.signupForm.value.verifyPassword,
        this.referralToken
      );

      if (!errorMessage) {
        await this.loginUser();
      } else {
        this.signupError = errorMessage;
      }
    } catch (error: any) {
      this.signupError =
        error?.error?.message ||
        error?.message ||
        'An unexpected error occurred. Please try again.';
    }
  }

  // Handle user login after successful signup
  private async loginUser(): Promise<void> {
    const loginResult = await this.authService.login(
      this.signupForm.value.email,
      this.signupForm.value.password
    );

    if (loginResult) {
      this.authService.saveToken(loginResult.token);
      this.authService.saveRoles(loginResult.roles);
      this.authService.saveEmail(this.signupForm.value.email);

      this.router.navigate(['/dashboard']);
    } else {
      this.signupError = 'Signup succeeded, but automatic login failed.';
    }
  }
}
