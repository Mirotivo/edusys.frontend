import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ManageLessonsComponent } from '../../components/manage-lessons/manage-lessons.component';
import { MessageListComponent } from '../../components/message-list/message-list.component';
import { MessageThreadComponent } from '../../components/message-thread/message-thread.component';

import { Chat } from '../../models/chat';

@Component({
  selector: 'app-messages',
  imports: [CommonModule, FormsModule, MessageListComponent, MessageThreadComponent, ManageLessonsComponent],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
  selectedContact: Chat | null = null;
}
