import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LessonCategory } from '../models/lesson-category';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/lesson/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<LessonCategory[]> {
    return this.http.get<LessonCategory[]>(`${this.apiUrl}/dashboard`);
  }

  getFilteredCategories(searchText: string): Observable<LessonCategory[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    let url = this.apiUrl;
    if (searchText && searchText.trim() !== '') {
      url += `?query=${encodeURIComponent(searchText.trim())}`;
    }

    return this.http.get<LessonCategory[]>(url, { headers });
  }

  createCategory(category: { name: string }): Observable<LessonCategory> {
    return this.http.post<LessonCategory>(`${this.apiUrl}`, category);
  }  
}
