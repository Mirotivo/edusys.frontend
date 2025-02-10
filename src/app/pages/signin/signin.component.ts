import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FacebookModule, FacebookService, InitParams, LoginResponse } from 'ngx-facebook';
import { ConfigService } from '../../services/config.service';
import { environment } from '../../environments/environment';
import { loadGapiInsideDOM } from 'gapi-script';
// Angular Material Design
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderCenterComponent } from '../../components/header-center/header-center.component';


declare const gapi: any;
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatRadioModule,
    MatSliderModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatMenuModule,
    MatToolbarModule,
    MatChipsModule,
    MatSelectModule,
    MatExpansionModule,
    MatListModule,
    MatSidenavModule,
    HeaderCenterComponent,
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
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
    this.configService.loadConfig().then(async () => {
      const initParams: InitParams = {
        appId: this.configService.get('facebookAppId'),
        cookie: true,
        xfbml: true,
        version: 'v21.0',
      };
      this.fb.init(initParams);

      await loadGapiInsideDOM();
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: this.configService.get('googleClientId'),
          scope: 'profile email',
        });
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

  /** ✅ Facebook Login */
  loginWithFacebook(): void {
    this.fb
      .login({ scope: 'email,public_profile' })
      .then(async (response: LoginResponse) => {
        const accessToken = response.authResponse.accessToken;
        console.log('✅ Facebook Login Success:', accessToken);
        await this.handleSocialLogin('facebook', accessToken);
      })
      .catch((error) => {
        console.error('❌ Facebook login error:', error);
        this.invalidLogin = true;
      });
  }

  /** ✅ Google Login */
  async loginWithGoogle(): Promise<void> {
    try {
      const auth2 = gapi.auth2.getAuthInstance();
      if (!auth2) throw new Error('Google Auth instance not initialized');

      const googleUser = await auth2.signIn();
      const idToken = googleUser.getAuthResponse().id_token;
      console.log('✅ Google Login Success:', idToken);

      await this.handleSocialLogin('google', idToken);
    } catch (error) {
      console.error('❌ Google Login Failed:', error);
      this.invalidLogin = true;
    }
  }

  /** ✅ Handle Social Login */
  private async handleSocialLogin(provider: string, token: string): Promise<void> {
    try {
      const result = await this.authService.socialLogin(provider, token);
      this.authService.saveToken(result.token);
      this.authService.saveRoles(result.roles);
      this.router.navigateByUrl(this.returnUrl);
    } catch (error) {
      console.error(`❌ ${provider} login verification failed:`, error);
      this.invalidLogin = true;
    }
  }
}
