import { Component } from '@angular/core';
import { Role } from '../../models/chat';
import { CommonModule } from '@angular/common';
import { Lesson, LessonStatus } from '../../models/lesson';
import { PropositionService } from '../../services/proposition.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-lessons',
  imports: [CommonModule],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss'
})
export class LessonsComponent {
  LessonStatus = LessonStatus;
  Role = Role;
  activeTab: string = 'all';
  combinedSessions: any[] = [];
  userId: number = 0;
  // Example Data (Replace with real data from API)
  propositions: any[] = [];
  lessons: any[] = [];

  constructor(
    private propositionService: PropositionService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loadPropositions();
  }

  loadPropositions(): void {
    this.propositionService.getAllLessonsAndPropositions().subscribe({
      next: (response) => {
        this.propositions = response.propositions;
        this.lessons = response.lessons;
        this.mergeSessions();
      },
      error: (err) => {
        console.error('Failed to fetch lessons and propositions:', err);
      }
    });
  }

  mergeSessions() {
    this.combinedSessions = [
      ...this.propositions.map(proposition => ({ ...proposition, type: 'Proposition' })),
      ...this.lessons.map(lesson => ({ ...lesson, type: 'Lesson' }))
    ];
  }

  respondToProposition(propositionId: number, accept: boolean) {
    this.propositionService.respondToProposition(propositionId, accept).subscribe({
      next: () => {
        // Update the UI after successful response
        this.propositions = this.propositions.filter(p => p.id !== propositionId);
        this.loadPropositions();
      },
      error: (err) => {
        console.error('Failed to respond to proposition:', err);
      }
    });
  }

  startVideoCall(lesson: Lesson) {
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

  cancelLesson(lessonId: number) {
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

}
