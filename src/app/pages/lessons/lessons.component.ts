import { Component } from '@angular/core';
import { Role } from '../../models/chat';
import { CommonModule } from '@angular/common';
import { LessonStatus } from '../../models/lesson';
import { PropositionService } from '../../services/proposition.service';

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
    private propositionService: PropositionService
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

  respondToProposition(id: number, accept: boolean) {
    console.log(`Responding to proposition ${id}, accept: ${accept}`);
  }

  startVideoCall(lesson: any) {
    console.log(`Starting video call for lesson ${lesson.id}`);
  }

  cancelLesson(id: number) {
    console.log(`Cancelling lesson ${id}`);
  }

}
