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
  loading = true;
  contacts: Chat[] = [];
  @Input() selectedContact: Chat | null = null;
  @Output() selectedContactChange = new EventEmitter<Chat>();

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
          let contact = this.contacts[0];
          this.selectedContact = contact;
          this.selectContact(contact);
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
    this.selectedContactChange.emit(contact);
  }

  // Reload a specific contact by ID
  selectContactById(contactId: number): void {
    const contact = this.contacts.find((c) => c.id === contactId);
    if (contact) {
      this.selectedContact = contact;
      this.selectContact(contact);
    }
  }

  onContactSelected(contactId: number): void {
    const contact = this.contacts.find((c) => c.id === contactId);
    if (contact) {
      this.selectedContact = contact;
      this.selectContact(contact);
    }
  }
}
