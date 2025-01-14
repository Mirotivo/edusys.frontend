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

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'search-results', component: SearchResultsComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'category/:name', component: CategoriesComponent },
    { path: 'about', component: AboutUsComponent },
    { path: 'terms', component: TermsComponent },
    { path: 'privacy-policy', component: PrivacyComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'payment/:id', component: PaymentComponent },
    { path: 'payment-result', component: PaymentResultComponent , canActivate: [AuthGuard] },
    { path: 'booking/:id', component: BookingComponent, canActivate: [AuthGuard] },
    { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
    { path: 'listings', component: ListingsComponent, canActivate: [AuthGuard] },
    { path: 'evaluations', component: EvaluationsComponent, canActivate: [AuthGuard] },
    { path: 'recommendation/:tokenId', component: RecommendationSubmissionComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'premium', component: PremiumComponent, canActivate: [AuthGuard] },
    { path: 'subscribe-premium', component: PremiumSubscriptionComponent, canActivate: [AuthGuard] },
    { path: 'goodbye', component: GoodbyeComponent },
];
