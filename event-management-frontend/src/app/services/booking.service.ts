import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, CreateBookingRequest } from '../models/event.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getBookings(page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${this.apiUrl}/bookings`, { params });
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/bookings/${id}`);
  }

  createBooking(booking: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/bookings`, booking);
  }

  confirmBooking(id: number): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/bookings/${id}/confirm`, {});
  }

  cancelBooking(id: number): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/bookings/${id}/cancel`, {});
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/my-bookings`);
  }

  getBookingsByEvent(eventId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/event/${eventId}`);
  }
}
