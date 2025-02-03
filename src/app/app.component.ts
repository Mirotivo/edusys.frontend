import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NotificationService } from './services/notification.service';
import { AuthService } from './services/auth.service';
import { NotificationEvent } from './models/notification';
import { ToastrService } from 'ngx-toastr';
import { MessagesComponent } from './pages/messages/messages.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
  currentRoute: string = '';
  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    // Check if the user is logged in
    if (this.authService.isLoggedIn()) {
      // Payment
      this.configService.loadConfig().then(() => {
        console.log('Config loaded:', this.configService.get('apiUrl'));
      });

      // Monitor the active route
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.urlAfterRedirects;
        }
      });

      // Start the notification service
      this.notificationService.startConnection(this.authService.getToken() ?? "");

      // Listen for notifications
      this.notificationService.onReceiveNotification((notification) => {
        this.toastr.info(notification.data.content, notification.message);
        // if (notification.eventName === NotificationEvent.NewMessage) {

        //   // Reload messages if the current route is the messages page
        //   if (this.currentRoute === '/messages') {
        //     this.reloadMessages(notification.data.recipientId);
        //   }
        //   else {
        //     this.toastr.info(notification.data.content, notification.message);
        //   }
        // }
      });
    }
  }
}
