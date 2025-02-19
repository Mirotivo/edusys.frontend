import { Injectable } from '@angular/core';
import { Review } from '../models/review';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = `${environment.apiUrl}/evaluations`;

  constructor(private http: HttpClient) { }

  getAllReviews(): Observable<{ pendingReviews: Review[]; receivedReviews: Review[]; sentReviews: Review[], recommendations: Review[] }> {
    return this.http.get<{ pendingReviews: Review[]; receivedReviews: Review[]; sentReviews: Review[], recommendations: Review[] }>(this.apiUrl);
  }

  submitReview(review: Review): Observable<any> {
    return this.http.post(`${this.apiUrl}/review`, review);
  }

  submitRecommendation(recommendation: Review): Observable<any> {
    return this.http.post(`${this.apiUrl}/recommendation`, recommendation);
  }
}
