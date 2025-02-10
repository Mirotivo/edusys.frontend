import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { MessagesComponent } from './pages/messages/messages.component';
import { ListingsComponent } from './pages/listings/listings.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PremiumComponent } from './pages/premium/premium.component';
import { EvaluationsComponent } from './pages/evaluations/evaluations.component';
import { SignupComponent } from './pages/signup/signup.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { BookingComponent } from './pages/booking/booking.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { PaymentResultComponent } from './pages/payment-result/payment-result.component';
import { RecommendationSubmissionComponent } from './pages/recommendation-submission/recommendation-submission.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { GoodbyeComponent } from './pages/goodbye/goodbye.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PremiumSubscriptionComponent } from './pages/premium-subscription/premium-subscription.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { HelpCenterComponent } from './pages/help-center/help-center.component';
import { StatesComponent } from './pages/states/states.component';
import { CareersComponent } from './pages/careers/careers.component';
import { OnlineCoursesComponent } from './pages/online-courses/online-courses.component';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';
import { CompleteRegistrationComponent } from './pages/complete-registration/complete-registration.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'search-results', component: SearchResultsComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'category/:name', component: CategoriesComponent },
    { path: 'confirm-email', component: ConfirmEmailComponent },
    { path: 'complete-registration', component: CompleteRegistrationComponent },
    { path: 'about', component: AboutUsComponent },
    { path: 'terms', component: TermsComponent },
    { path: 'states', component: StatesComponent },
    { path: 'careers', component: CareersComponent },
    { path: 'online-courses', component: OnlineCoursesComponent },
    { path: 'privacy-policy', component: PrivacyComponent },
    { path: 'help-centre', loadComponent: () => import('./pages/help-center/help-center.component').then(m => m.HelpCenterComponent) },
    { path: 'signup', component: SignupComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'payment/:id', component: PaymentComponent },
    { path: 'payment-result', component: PaymentResultComponent , canActivate: [AuthGuard] },
    { path: 'booking/:id', component: BookingComponent, canActivate: [AuthGuard] },
    { path: 'messages', loadComponent: () => import('./pages/messages/messages.component').then(m => m.MessagesComponent), canActivate: [AuthGuard] },
    { path: 'listings', component: ListingsComponent, canActivate: [AuthGuard] },
    { path: 'evaluations', component: EvaluationsComponent, canActivate: [AuthGuard] },
    { path: 'evaluations', loadComponent: () => import('./pages/evaluations/evaluations.component').then(m => m.EvaluationsComponent), canActivate: [AuthGuard] },
    { path: 'recommendation/:tokenId', loadComponent: () => import('./pages/recommendation-submission/recommendation-submission.component').then(m => m.RecommendationSubmissionComponent), canActivate: [AuthGuard] },
    { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [AuthGuard] },
    { path: 'premium', component: PremiumComponent, canActivate: [AuthGuard] },
    { path: 'subscribe-premium', component: PremiumSubscriptionComponent, canActivate: [AuthGuard] },
    { path: 'goodbye', component: GoodbyeComponent },
];
