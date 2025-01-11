import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Chat } from '../../models/chat';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss'
})
export class MessageListComponent implements OnInit {
  @Output() contactSelected = new EventEmitter<Chat>();
  loading = true;
  contacts: Chat[] = [];
  selectedContact: Chat | null = null;

  constructor(
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.chatService.getChats().subscribe({
      next: (data) => {
        this.contacts = data;
        if (this.contacts.length > 0) {
          this.selectContact(this.contacts[0]);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch contacts:', err);
        this.loading = false;
      },
    });
  }

  selectContact(contact: Chat): void {
    this.selectedContact = contact;
    this.contactSelected.emit(contact);
  }
  
  // Reload a specific contact by ID
  selectContactById(contactId: number): void {
    const contact = this.contacts.find((c) => c.id === contactId);
    if (contact) {
      this.selectContact(contact);
    }
  }

  onContactSelected(contactId: number): void {
    const contact = this.contacts.find((c) => c.id === contactId);
    if (contact) {
      this.selectContact(contact);
    }
  }
}
