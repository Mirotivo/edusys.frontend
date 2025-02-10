import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Chat } from '../../models/chat';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-message-list',
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
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss'
})
export class MessageListComponent implements OnInit {
  loading = true;
  contacts: Chat[] = [];
  @Input() selectedContact: Chat | null = null;
  @Output() selectedContactChange = new EventEmitter<Chat>();
  searchQuery: string = '';

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

  getFilteredContacts(): Chat[] {
    return this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }  
}
