import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'user', loadComponent: () => import('./pages/user/user-dashboard.component').then(m => m.UserDashboardComponent) },
  { path: 'events', loadComponent: () => import('./pages/events/events.component').then(m => m.EventsComponent) },
  { path: 'events/:id', loadComponent: () => import('./pages/event-detail/event-detail.component').then(m => m.EventDetailComponent) },
  { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'my-events', loadComponent: () => import('./pages/my-events/my-events.component').then(m => m.MyEventsComponent), canActivate: [authGuard] },
  { path: 'create-event', loadComponent: () => import('./pages/create-event/create-event.component').then(m => m.CreateEventComponent), canActivate: [authGuard] },
  { path: 'edit-event/:id', loadComponent: () => import('./pages/edit-event/edit-event.component').then(m => m.EditEventComponent), canActivate: [adminGuard] },
  { path: 'my-bookings', loadComponent: () => import('./pages/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent), canActivate: [authGuard] },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent), canActivate: [adminGuard] },
  { path: '**', redirectTo: '/home' }
];
