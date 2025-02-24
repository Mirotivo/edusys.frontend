import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { MessagesComponent } from './pages/messages/messages.component';
import { PremiumComponent } from './pages/premium/premium.component';
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
import { SidebarLayoutComponent } from './layout/sidebar-layout/sidebar-layout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NewInvoicesComponent } from './pages/new-invoices/new-invoices.component';
import { NewPaymentsComponent } from './pages/new-payments/new-payments.component';
import { EvaluationsComponent } from './pages/evaluations/evaluations.component';
import { ListingsComponent } from './pages/listings/listings.component';
import { FooterLayoutComponent } from './layout/footer-layout/footer-layout.component';
import { HeaderLayoutComponent } from './layout/header-layout/header-layout.component';
import { LessonsComponent } from './pages/lessons/lessons.component';

export const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'complete-registration', component: CompleteRegistrationComponent },

  {
    path: '',
    component: HeaderLayoutComponent,
    children: [
      {
        path: '',
        component: FooterLayoutComponent, 
        children: [
          { path: '', component: HomeComponent },
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
          { path: 'payment/:id', loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent), canActivate: [AuthGuard] },
          { path: 'payment-result', loadComponent: () => import('./pages/payment-result/payment-result.component').then(m => m.PaymentResultComponent), canActivate: [AuthGuard] },
          { path: 'listing/:id', loadComponent: () => import('./pages/listing/listing.component').then(m => m.ListingComponent) },
          { path: 'booking/:id', loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent) },
          { path: 'recommendation/:tokenId', loadComponent: () => import('./pages/recommendation-submission/recommendation-submission.component').then(m => m.RecommendationSubmissionComponent), canActivate: [AuthGuard] },
          { path: 'premium', loadComponent: () => import('./pages/premium/premium.component').then(m => m.PremiumComponent), canActivate: [AuthGuard] },
          { path: 'subscribe-premium', loadComponent: () => import('./pages/premium-subscription/premium-subscription.component').then(m => m.PremiumSubscriptionComponent), canActivate: [AuthGuard] }
        ]
      },    
      // Dashboard Routes
      {
        path: '',
        component: FooterLayoutComponent,
        children: [
          {
            path: 'dashboard',
            component: SidebarLayoutComponent,
            canActivate: [AuthGuard],
            children: [
              { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
              { path: 'listings', component: ListingsComponent, data: { title: 'Listings' } },
              { path: 'lessons', component: LessonsComponent, data: { title: 'Lessons' } },
              { path: 'evaluations', component: EvaluationsComponent, data: { title: 'Evaluations' } },
              { path: 'payments', component: NewPaymentsComponent, data: { title: 'Payments' } },
              { path: 'invoices', component: NewInvoicesComponent, data: { title: 'Invoices' } },
              { path: 'profile', component: ProfileComponent, data: { title: 'Profile' } },
            ]
          }
        ]
      },
      {
        path: 'messages',
        component: MessagesComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  
]
