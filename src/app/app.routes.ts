import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { MessagesComponent } from './pages/messages/messages.component';
import { ListingsComponent } from './pages/listings/listings.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PremiumComponent } from './pages/premium/premium.component';
import { EvaluationsComponent } from './pages/evaluations/evaluations.component';
import { SignupComponent } from './pages/signup/signup.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ListingComponent } from './pages/listing/listing.component';
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
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'confirm-email', component: ConfirmEmailComponent },
    { path: 'complete-registration', component: CompleteRegistrationComponent },
    { path: 'terms', component: TermsComponent },
    { path: 'privacy-policy', component: PrivacyComponent },
    { path: 'goodbye', component: GoodbyeComponent },

    { path: 'search-results', loadComponent: () => import('./pages/search-results/search-results.component').then(m => m.SearchResultsComponent) },
    { path: 'category/:name', loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent) },
    { path: 'about', loadComponent: () => import('./pages/about-us/about-us.component').then(m => m.AboutUsComponent) },
    { path: 'states', loadComponent: () => import('./pages/states/states.component').then(m => m.StatesComponent) },
    { path: 'careers', loadComponent: () => import('./pages/careers/careers.component').then(m => m.CareersComponent) },
    { path: 'online-courses', loadComponent: () => import('./pages/online-courses/online-courses.component').then(m => m.OnlineCoursesComponent) },
    { path: 'help-centre', loadComponent: () => import('./pages/help-center/help-center.component').then(m => m.HelpCenterComponent) },
    { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [AuthGuard] },
    { path: 'payment/:id', loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent), canActivate: [AuthGuard] },
    { path: 'payment-result', loadComponent: () => import('./pages/payment-result/payment-result.component').then(m => m.PaymentResultComponent), canActivate: [AuthGuard] },
    { path: 'listing/:id', loadComponent: () => import('./pages/listing/listing.component').then(m => m.ListingComponent) },
    { path: 'booking/:id', loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent) },
    { path: 'messages', loadComponent: () => import('./pages/messages/messages.component').then(m => m.MessagesComponent), canActivate: [AuthGuard] },
    { path: 'listings', loadComponent: () => import('./pages/listings/listings.component').then(m => m.ListingsComponent), canActivate: [AuthGuard] },
    { path: 'evaluations', loadComponent: () => import('./pages/evaluations/evaluations.component').then(m => m.EvaluationsComponent), canActivate: [AuthGuard] },
    { path: 'recommendation/:tokenId', loadComponent: () => import('./pages/recommendation-submission/recommendation-submission.component').then(m => m.RecommendationSubmissionComponent), canActivate: [AuthGuard] },
    { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [AuthGuard] },
    { path: 'premium', loadComponent: () => import('./pages/premium/premium.component').then(m => m.PremiumComponent), canActivate: [AuthGuard] },
    { path: 'subscribe-premium', loadComponent: () => import('./pages/premium-subscription/premium-subscription.component').then(m => m.PremiumSubscriptionComponent), canActivate: [AuthGuard] }
  ];
