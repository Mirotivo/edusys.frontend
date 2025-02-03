import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chat, Role } from '../../models/chat';
import { Lesson, LessonStatus } from '../../models/lesson';
import { PropositionService } from '../../services/proposition.service';
import { ListingService } from '../../services/listing.service';
import { ModalComponent } from '../modal/modal.component';
import { ProposeLessonComponent } from '../propose-lesson/propose-lesson.component';
import { Listing } from '../../models/listing';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-manage-lessons',
  imports: [CommonModule, FormsModule, ModalComponent, ProposeLessonComponent],
  templateUrl: './manage-lessons.component.html',
  styleUrl: './manage-lessons.component.scss'
})
export class ManageLessonsComponent implements OnInit, OnChanges {
  LessonStatus = LessonStatus;
  Role = Role;
  @Input() selectedContact: Chat | null = null;
  activeTab: string = 'propositions'; // Default active tab
  propositions: Lesson[] = [];
  lessons: Lesson[] = [];
  selectedListing!: Listing;

  constructor(
    private propositionService: PropositionService,
    private notificationService: NotificationService,
    private listingService: ListingService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // Listen for notifications
    this.notificationService.onReceiveNotification((notification) => {
      // if (this.selectedContact && notification.data.senderId === this.selectedContact.recipientId) {
      if (this.selectedContact) {
        this.loadListing(this.selectedContact.listingId);
        this.loadPropositions(this.selectedContact.recipientId, this.selectedContact.listingId);
      }
    });
  }

  ngOnChanges(): void {
    if (this.selectedContact) {
      this.loadListing(this.selectedContact.listingId);
      this.loadPropositions(this.selectedContact.recipientId, this.selectedContact.listingId);
    }
  }


  loadPropositions(contactId: string, listingId: number): void {
    this.propositionService.getPropositions(contactId, listingId).subscribe({
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
          this.loadPropositions(this.selectedContact.recipientId, this.selectedContact.listingId);
        }
      },
      error: (err) => {
        console.error('Failed to respond to proposition:', err);
      }
    });
  }

  startVideoCall(lesson: Lesson): void {
    this.userService.getUser().subscribe({
      next: (user) => {
        const displayName = user.firstName ? `${user.firstName} ${user.lastName}`.trim() : user.email;

        const contentWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const contentHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        const newWindow = window.open('', '', `width=${contentWidth},height=${contentHeight},toolbar=0,location=0,status=0,menubar=0,scrollbars=yes,resizable=yes`);
        const rawHtml = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Jitsi Video Call</title>
            <!-- jQuery Library -->
            <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
            <!-- Jitsi External API -->
            <script src="${lesson.meetingUrl}/external_api.js"></script>
          </head>
          <body>
            <div id="jitsi-container" style="height: 100vh; width: 100%;"></div>
            <script>
              document.addEventListener('DOMContentLoaded', function () {
                  const options = {
                      roomName: "${lesson.meetingRoomName}",
                      parentNode: document.getElementById('jitsi-container'),
                      userInfo: {
                        displayName: "${displayName}"
                      },
                      jwt: "${lesson.meetingToken}",
                      configOverwrite: {
                          enableWelcomePage: false,
                          prejoinPageEnabled: false,
                          startWithAudioMuted: false,
                          startWithVideoMuted: false
                      },
                      interfaceConfigOverwrite: {
                          filmStripOnly: false
                      }
                  };

                  const api = new JitsiMeetExternalAPI("${lesson.meetingDomain}", options);

                  api.addEventListener('videoConferenceJoined', function () {
                      console.log("${displayName} has joined the video conference");
                  });

                  api.addEventListener('videoConferenceLeft', function () {
                      console.log("${displayName} has left the video conference");
                      api.dispose();
                      window.close();
                  });
              });
            </script>
          </body>
          </html>
        `;
        if (newWindow) {
          newWindow.document.write(rawHtml);
          newWindow.document.close();
        }
      },
      error: (err: any) => {
        console.error('Failed to fetch user:', err);
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
