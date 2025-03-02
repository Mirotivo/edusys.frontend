import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { TableComponent } from '../../layout/shared/table/table.component';

import { AlertService } from '../../services/alert.service';
import { LessonService } from '../../services/lesson.service';
import { UserService } from '../../services/user.service';

import { LessonStatus } from '../../models/enums/lesson-status';
import { LessonType } from '../../models/enums/lesson-type';
import { UserRole } from '../../models/enums/user-role';
import { Lesson } from '../../models/lesson';

@Component({
  selector: 'app-lessons',
  imports: [CommonModule, FormsModule, TableComponent],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss'
})
export class LessonsComponent {
  lessons: Lesson[] = [];
  page: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 50, 100];
  totalResults: number = 0;
  lessonColumns = [
    { key: 'recipientName', label: 'With' },
    { key: 'topic', label: 'Topic' },
    { key: 'date', label: 'Date', formatter: (value: any) => new DatePipe('en-US').transform(value, 'dd MMM yyyy, h:mm a') || 'N/A' },
    { key: 'duration', label: 'Duration' },
    { key: 'price', label: 'Price', formatter: (value: any) => value ? `$${value}` : 'N/A' },
    {
      key: 'status',
      label: 'Status',
      formatter: (value: any) => {
        const statusText = LessonStatus[value as keyof typeof LessonStatus]; // ✅ Convert to string
        const statusClass: Record<string, string> = {  // ✅ Allow string-based indexing
          [LessonStatus.Proposed]: 'bg-warning',
          [LessonStatus.Booked]: 'bg-success',
          [LessonStatus.Canceled]: 'bg-danger',
          [LessonStatus.Completed]: 'bg-info'
        };

        return `<span class="badge ${statusClass[value as keyof typeof LessonStatus] || 'bg-secondary'}">${statusText}</span>`;
      }
    }
  ];
  lessonActions = [
    {
      label: 'Start Call',
      icon: 'fa-video',
      class: 'btn-sm bg-primary-light',
      callback: (session: any) => this.startVideoCall(session),
      condition: (session: any) => session.type === LessonType.Lesson && session.status === LessonStatus.Booked
    },
    {
      label: 'Cancel Lesson',
      icon: 'fa-times-circle',
      class: 'btn-sm bg-warning-light',
      callback: (session: any) => this.cancelLesson(session.id),
      condition: (session: any) => session.type === LessonType.Lesson && session.status === LessonStatus.Booked
    },
    {
      label: 'Accept',
      icon: 'fa-check',
      class: 'btn-sm bg-success-light',
      callback: (session: any) => this.respondToProposition(session.id, true),
      condition: (session: any) => session.type === LessonType.Proposition && session.recipientRole === UserRole.Student
    },
    {
      label: 'Refuse',
      icon: 'fa-times',
      class: 'btn-sm bg-danger-light',
      callback: (session: any) => this.respondToProposition(session.id, false),
      condition: (session: any) => session.type === LessonType.Proposition && session.recipientRole === UserRole.Student
    },
    {
      label: 'Cancel',
      icon: 'fa-ban',
      class: 'btn-sm bg-danger-light',
      callback: (session: any) => this.respondToProposition(session.id, false),
      condition: (session: any) => session.type === LessonType.Proposition && session.recipientRole === UserRole.Tutor
    }
  ];
  constructor(
    private alertService: AlertService,
    private lessonService: LessonService,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadLessons();
  }

  loadLessons(): void {
    this.lessonService.getAllLessons(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.lessons = response.lessons.results;
        this.totalResults = response.lessons.totalResults;
      },
      error: (err) => {
        console.error('Failed to fetch lessons and propositions:', err);
      }
    });
  }


  async respondToProposition(propositionId: number, accept: boolean) {
    if (!accept) {
      const confirmed = await this.alertService.confirm(
        'This lesson will be canceled.',
        'Cancel Lesson',
        'Yes, cancel it!'
      );
      if (!confirmed) return;
    }

    this.lessonService.respondToProposition(propositionId, accept).subscribe({
      next: () => {
        // Update the UI after successful response
        this.loadLessons();
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

  async cancelLesson(lessonId: number) {
    const confirmed = await this.alertService.confirm(
      'This lesson will be canceled.',
      'Cancel Lesson',
      'Yes, cancel it!'
    );
    if (!confirmed) return;

    this.lessonService.cancelLesson(lessonId).subscribe({
      next: () => {
        this.toastr.success('Lesson canceled successfully.', 'Success');
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

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadLessons();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.loadLessons();
  }
}
