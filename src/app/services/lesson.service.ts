import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Lesson } from '../models/lesson';
import { PagedResult } from '../models/paged-result';
import { Proposition } from '../models/proposition';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private apiUrl = `${environment.apiUrl}/lessons`;

  constructor(private http: HttpClient) {}

  proposeLesson(lesson: Proposition): Observable<void> {
    // Ensure duration is in "HH:mm:ss" format
    const formattedLesson = {
      ...lesson,
      duration: this.formatDuration(lesson.duration),
    };

    return this.http.post<void>(`${this.apiUrl}/proposeLesson`, formattedLesson);
  }
  
  getLessons(contactId: string, listingId: number): Observable<{ lessons: PagedResult<Lesson> }> {
    return this.http.get<{ lessons: PagedResult<Lesson> }>(`${this.apiUrl}/${contactId}/${listingId}`);
  }
  
  getAllLessons(page: number = 1, pageSize: number = 10): Observable<{ lessons: PagedResult<Lesson> }> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.http.get<{ lessons: PagedResult<Lesson> }>(`${this.apiUrl}`, { params });
  }

  respondToProposition(propositionId: number, accept: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/respondToProposition/${propositionId}`, accept);
  }
  
  cancelLesson(lessonId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${lessonId}/cancel`);
  }

  private formatDuration(hours: number): string {
    const totalSeconds = hours * 3600; // Convert hours to seconds
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}