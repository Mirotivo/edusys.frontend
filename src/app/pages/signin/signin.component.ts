import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FacebookModule, FacebookService, InitParams, LoginResponse } from 'ngx-facebook';
import { ConfigService } from '../../services/config.service';
import { environment } from '../../environments/environment';

declare const google: any;
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

  constructor(private fb: FacebookService, private form: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService, private configService: ConfigService) { }

  ngOnInit(): void {
    // Initialize the form with Reactive Forms
    this.loginForm = this.form.group({
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

    // Initialize the Facebook SDK with your App ID
    this.configService.loadConfig().then(() => {

      const initParams: InitParams = {
        appId: this.configService.get('facebookAppId'),
        cookie: true,
        xfbml: true,
        version: 'v21.0',
      };
      this.fb.init(initParams);


      google.accounts.id.initialize({
        client_id: this.configService.get('googleClientId'),
        callback: this.loginWithGoogle.bind(this),
        ux_mode: 'redirect',
        login_uri: `${environment.frontendUrl}/api/signin-google`,
        redirect_uri: `${environment.frontendUrl}/api/signin-google`
      });

      // Display the One Tap prompt
      google.accounts.id.prompt();
      
      // Render the Google Sign-In button
      google.accounts.id.renderButton(document.getElementById('google-login-button'), {
        theme: 'outline',
        size: 'large',
      });

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

  // Handle Google login
  loginWithGoogle(response: any): void {
    const idToken = response.credential;

    this.authService.socialLogin('google', idToken).then(
      (result) => this.handleLoginSuccess(result),
      (error) => {
        console.error('Google login failed:', error);
        this.invalidLogin = true;
      }
    );
  }

  // Handle Facebook login
  loginWithFacebook(): void {
    this.fb
      .login({ scope: 'email,public_profile' })
      .then((response: LoginResponse) => {
        const accessToken = response.authResponse.accessToken;

        this.authService.socialLogin('facebook', accessToken).then(
          (result) => this.handleLoginSuccess(result),
          (error) => {
            console.error('Facebook login failed:', error);
            this.invalidLogin = true;
          }
        );
      })
      .catch((error) => {
        console.error('Facebook login error:', error);
        this.invalidLogin = true;
      });
  }

  // Handle login success (common for traditional and social logins)
  private handleLoginSuccess(result: { token: string; roles: string[] }): void {
    this.authService.saveToken(result.token);
    this.authService.saveRoles(result.roles);
    this.router.navigateByUrl(this.returnUrl);
  }

}
