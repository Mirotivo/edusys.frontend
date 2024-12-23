import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupModel = {
    email: '',
    password: '',
    verifyPassword: '',
  };
  signupError = '';
  referralToken: string | null = null;
  passwordMismatch = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.referralToken = params['referral'] || null;
      this.cdr.detectChanges();
    });
  }

  // Validate email format using regex
  private isValidEmail(email: string): boolean {
    const emailPattern = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailPattern.test(email);
  }

  // Check if passwords match
  private isPasswordMatch(): boolean {
    return this.signupModel.password === this.signupModel.verifyPassword;
  }
  
  // Validate the form fields
  public isFormValid(): boolean {
    const isEmailValid = this.isValidEmail(this.signupModel.email);
    const isPasswordMatch = this.isPasswordMatch();
    this.passwordMismatch = !isPasswordMatch;

    return (
      isEmailValid &&
      isPasswordMatch &&
      this.signupModel.email.trim() !== '' &&
      this.signupModel.password.trim() !== '' &&
      this.signupModel.verifyPassword.trim() !== ''
    );
  }

  // Handle the form submission
  async onSignup(): Promise<void> {
    if (!this.isFormValid()) {
      return;
    }

    try {
      const errorMessage = await this.authService.register(
        this.signupModel.email,
        this.signupModel.password,
        this.signupModel.verifyPassword,
        this.referralToken
      );

      if (!errorMessage) {
        await this.loginUser();
      } else {
        this.signupError = errorMessage;
      }
    } catch (error: any) {
      if (error?.error?.errors) {
        this.signupError = error.error.message || 'Validation failed.';
      } else if (error?.message) {
        this.signupError = error.message;
      } else {
        this.signupError = 'An unexpected error occurred. Please try again.';
      }
    }
  }

  // Handle user login after successful signup
  private async loginUser(): Promise<void> {
    const loginResult = await this.authService.login(
      this.signupModel.email,
      this.signupModel.password
    );

    if (loginResult) {
      this.authService.saveToken(loginResult.token);
      this.authService.saveRoles(loginResult.roles);
      this.authService.saveEmail(this.signupModel.email);

      this.router.navigate(['/dashboard']);
    } else {
      this.signupError = 'Signup succeeded, but automatic login failed.';
    }
  }
}
