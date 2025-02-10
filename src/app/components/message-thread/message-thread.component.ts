import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Chat } from '../../models/chat';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
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


@Component({
  selector: 'app-message-thread',
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

    CommonModule, FormsModule],
  templateUrl: './message-thread.component.html',
  styleUrl: './message-thread.component.scss'
})
export class MessageThreadComponent implements AfterViewInit, OnInit, OnChanges {
  @Input() selectedContact: Chat | null = null;
  @Output() messageSent = new EventEmitter<void>();
  @ViewChild('chatMessages', { static: false }) chatMessagesContainer!: ElementRef;
  newMessage: string = '';
  messageSuccess: boolean = false;

  constructor(
    private chatService: ChatService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Listen for notifications
    this.notificationService.onReceiveNotification((notification) => {
      if (this.selectedContact && notification.data.listingId === this.selectedContact.listingId && notification.data.senderId === this.selectedContact.recipientId) {
        this.selectedContact.messages.push({
          text: notification.data.content,
          sentBy: 'contact',
          timestamp: notification.data.timestamp,
        });

        // Scroll to the bottom to display the new message
        this.scrollToBottom();
      }
    });
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  
  ngOnChanges(): void {
    if (this.selectedContact) {
      this.scrollToBottom();
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedContact) {
      this.selectedContact?.messages.push({
        text: this.newMessage,
        sentBy: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      this.scrollToBottom();
      this.messageSent.emit();
      var toBeSent = this.newMessage;
      this.newMessage = '';

      this.chatService.sendMessage({
        listingId: this.selectedContact.listingId,
        recipientId: this.selectedContact.recipientId,
        content: toBeSent,
      }).subscribe({
        next: () => {
          this.messageSuccess = true;
          setTimeout(() => (this.messageSuccess = false), 3000);
        },
        error: (err) => {
          console.error('Failed to send message:', err);
        },
      });
    }
  }

  private scrollToBottom(): void {
    this.cdr.detectChanges();
    if (this.chatMessagesContainer) {
      const element = this.chatMessagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
}
