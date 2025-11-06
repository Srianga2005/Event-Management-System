import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, CreateEventRequest, EventStatus } from '../models/event.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getEvents(page: number = 0, size: number = 10, sortBy: string = 'startDateTime', sortDir: string = 'asc'): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    
    return this.http.get<any>(`${this.apiUrl}/events`, { params });
  }

  getUpcomingEvents(page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${this.apiUrl}/events/upcoming`, { params });
  }

  searchEvents(keyword: string, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${this.apiUrl}/events/search`, { params });
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/events/${id}`);
  }

  // Admin only: get pending events for moderation
  getPendingEvents(page: number = 0, size: number = 20, sortBy: string = 'createdAt', sortDir: string = 'desc'): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    return this.http.get<any>(`${this.apiUrl}/events/pending`, { params });
  }

  createEvent(event: CreateEventRequest): Observable<Event> {
    const payload: any = {
      title: event.title,
      description: event.description,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      location: event.location,
      maxAttendees: event.maxAttendees,
      ticketPrice: event.ticketPrice,
      imageUrl: event.imageUrl,
      category: { id: event.categoryId }
    };
    return this.http.post<Event>(`${this.apiUrl}/events`, payload);
  }

  updateEvent(id: number, event: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/events/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/events/${id}`);
  }

  getMyEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events/my-events`);
  }

  // Submit an event for admin approval (for normal users)
  submitEvent(event: CreateEventRequest): Observable<Event> {
    const payload: any = {
      title: event.title,
      description: event.description,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      location: event.location,
      maxAttendees: event.maxAttendees,
      ticketPrice: event.ticketPrice,
      imageUrl: event.imageUrl,
      status: EventStatus.PENDING,
      category: { id: event.categoryId }
    };
    return this.http.post<Event>(`${this.apiUrl}/events/submit`, payload);
  }

  // Admin moderation
  approveEvent(id: number): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/events/${id}/approve`, {});
  }

  rejectEvent(id: number): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/events/${id}/reject`, {});
  }
}
