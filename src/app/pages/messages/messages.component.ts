import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { NavigationBarComponent } from '../../components/navigation-bar/navigation-bar.component';
import { Chat } from '../../models/chat';
import { MessageListComponent } from '../../components/message-list/message-list.component';
import { MessageThreadComponent } from '../../components/message-thread/message-thread.component';
import { ManageLessonsComponent } from '../../components/manage-lessons/manage-lessons.component';

@Component({
  selector: 'app-messages',
  imports: [CommonModule, FormsModule, HeaderComponent, NavigationBarComponent, MessageListComponent, MessageThreadComponent, ManageLessonsComponent],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
  selectedContact: Chat | null = null;
}
