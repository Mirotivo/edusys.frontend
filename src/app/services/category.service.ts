import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LessonCategory } from '../models/lesson-category';
import { environment } from '../environments/environment';
import { PagedResult } from '../models/paged-result';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/lesson/categories`;

  constructor(private http: HttpClient) {}

  getFilteredCategories(searchText: string): Observable<PagedResult<LessonCategory>> {
    let url = this.apiUrl;
    if (searchText && searchText.trim() !== '') {
      url += `?query=${encodeURIComponent(searchText.trim())}`;
    }

    return this.http.get<PagedResult<LessonCategory>>(url);
  }

  createCategory(category: { name: string }): Observable<LessonCategory> {
    return this.http.post<LessonCategory>(`${this.apiUrl}`, category);
  }  
}
