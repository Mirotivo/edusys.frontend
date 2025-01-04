import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chat } from '../../models/chat';
import { LessonStatus } from '../../models/lesson';
import { PropositionService } from '../../services/proposition.service';
import { ListingService } from '../../services/listing.service';
import { ModalComponent } from '../modal/modal.component';
import { ProposeLessonComponent } from '../propose-lesson/propose-lesson.component';
import { Listing } from '../../models/listing';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-manage-lessons',
  imports: [CommonModule, FormsModule, ModalComponent, ProposeLessonComponent],
  templateUrl: './manage-lessons.component.html',
  styleUrl: './manage-lessons.component.scss'
})
export class ManageLessonsComponent implements OnInit, OnChanges {
  LessonStatus = LessonStatus;
  @Input() selectedContact: Chat | null = null;
  activeTab: string = 'propositions'; // Default active tab
  propositions: any[] = [];
  lessons: any[] = [];
  selectedListing!: Listing;

  constructor(
    private propositionService: PropositionService,
    private notificationService: NotificationService,
    private listingService: ListingService
  ) { }

  ngOnInit(): void {
    // Listen for notifications
    this.notificationService.onReceiveNotification((notification) => {
      // if (this.selectedContact && notification.data.senderId === this.selectedContact.recipientId) {
      if (this.selectedContact) {
        this.loadListing(this.selectedContact.listingId);
        this.loadPropositions(this.selectedContact.studentId);  
        }
    });
  }

  ngOnChanges(): void {
    if (this.selectedContact) {
      this.loadListing(this.selectedContact.listingId);
      this.loadPropositions(this.selectedContact.studentId);  
    }
  }


  loadPropositions(contactId: string): void {
    this.propositionService.getPropositions(contactId).subscribe({
      next: (response) => {
        this.propositions = response.propositions;
        this.lessons = response.lessons;
      },
      error: (err) => {
        console.error('Failed to fetch contact details:', err);
      }
    });
  }

  loadListing(listingId: number): void {
    this.listingService.getListing(listingId).subscribe({
      next: (listing) => {
        this.selectedListing = listing;
      },
      error: (err) => {
        console.error('Failed to fetch listing:', err);
      },
    });
  }


  respondToProposition(propositionId: number, accept: boolean): void {
    this.propositionService.respondToProposition(propositionId, accept).subscribe({
      next: () => {
        // Update the UI after successful response
        this.propositions = this.propositions.filter(p => p.id !== propositionId);
        if (this.selectedContact) {
          this.loadListing(this.selectedContact.listingId);
          this.loadPropositions(this.selectedContact.studentId);  
        }
      },
      error: (err) => {
        console.error('Failed to respond to proposition:', err);
      }
    });
  }

  cancelLesson(lessonId: number): void {
    this.propositionService.cancelLesson(lessonId).subscribe({
      next: () => {
        alert('Lesson canceled successfully.');
        // Update the lesson status locally to reflect the cancellation
        const lesson = this.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          lesson.status = LessonStatus.Canceled;
        }
      },
      error: (err) => {
        console.error('Failed to cancel lesson:', err);
      },
    });
  }



  isModalOpen = false;

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    // Reload the listing for the selected contact
    // if (this.selectedContact) {
    //   this.selectContact(this.selectedContact);
    // }
  }

  handleProposeLesson(event: { date: string; duration: number; price: number }): void {
    // Perform the action, e.g., send the proposal to the backend
  }


}
