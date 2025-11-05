import { User } from './user.model';

export interface Event {
  id: number;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  maxAttendees: number;
  ticketPrice: number;
  imageUrl?: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
  organizer: User;
  category: Category;
  bookings?: Booking[];
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: number;
  numberOfTickets: number;
  totalAmount: number;
  status: BookingStatus;
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  event: Event;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export interface CreateEventRequest {
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  maxAttendees: number;
  ticketPrice: number;
  imageUrl?: string;
  categoryId: number;
  status?: string;
}

export interface CreateBookingRequest {
  eventId: number;
  numberOfTickets: number;
}
