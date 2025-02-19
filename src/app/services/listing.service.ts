import { Injectable } from '@angular/core';
import { Listing } from '../models/listing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private apiUrl = `${environment.apiUrl}/listings`;

  constructor(private http: HttpClient) { }

  searchListings(query: string, selectedCategories: string[], page: number = 1, pageSize: number = 10): Observable<any> {
    const params = {
      query: query,
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  getListing(listingId: number): Observable<Listing> {
    return this.http.get<Listing>(`${this.apiUrl}/${listingId}`);
  }

  getListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(this.apiUrl);
  }

  createListing(newListing: Listing): Observable<Listing> {
    // Prepare FormData with the image and listing details
    const formData = new FormData();
    formData.append('listingImage', newListing.listingImage as File);
    formData.append('title', newListing.title || '');
    formData.append('aboutLesson', newListing.aboutLesson || '');
    formData.append('aboutYou', newListing.aboutYou || '');
    if (newListing.lessonCategoryId !== null && newListing.lessonCategoryId !== undefined) {
      formData.append('lessonCategoryId', String(newListing.lessonCategoryId));
    }
    if (newListing.lessonCategory !== null && newListing.lessonCategory !== undefined) {
      formData.append('lessonCategory', String(newListing.lessonCategory));
    }
    formData.append('locations', (newListing.locations || []).join(','));
    formData.append('rates.hourly', String(newListing.rates?.hourly || 0));
    formData.append('rates.fiveHours', String(newListing.rates?.fiveHours || 0));
    formData.append('rates.tenHours', String(newListing.rates?.tenHours || 0));

    return this.http.post<Listing>(`${this.apiUrl}/create-listing`, formData);
  }


  updateListingVisibility(listingId: number, isVisible: boolean): Observable<any> {
    const body = { isVisible };

    return this.http.post<any>(`${this.apiUrl}/${listingId}/toggle-visibility`, body);
  }


  deleteListing(listingId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${listingId}/delete`);
  }

  updateListingTitle(listingId: number, title: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${listingId}/update-title`, { title });
  }

  updateListingImage(listingId: number, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);

    return this.http.put<any>(`${this.apiUrl}/${listingId}/update-image`, formData);
  }

  updateListingLocations(listingId: number, locations: string[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${listingId}/update-locations`, locations);
  }

  updateListingDescription(listingId: number, aboutLesson: string, aboutYou: string): Observable<any> {
    const body = { aboutLesson, aboutYou };
    return this.http.put<any>(`${this.apiUrl}/${listingId}/update-description`, body);
  }

  updateListingRates(listingId: number, rates: { hourly: number; fiveHours: number; tenHours: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${listingId}/update-rates`, rates);
  }

  updateListingCategory(listingId: number, lessonCategoryId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${listingId}/update-category`, { lessonCategoryId });
  }
}
