import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class SigninComponent {
  loginForm!: FormGroup;
  invalidLogin = false;
  returnUrl: string = '/';

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Initialize the form with Reactive Forms
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],
      password: ['', [Validators.required]],
    });
    
    // Get the returnUrl from query params or use the default '/'
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });
  }

  // Handle the login form submission
  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    try {
      const result = await this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      );

      if (result) {
        this.authService.saveToken(result.token);
        this.authService.saveRoles(result.roles);
        this.authService.saveEmail(this.loginForm.value.email);

        // Redirect to returnUrl or dashboard
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.invalidLogin = true;
      }
    } catch (error) {
      console.error(error);
      this.invalidLogin = true;
    }
  }
}
