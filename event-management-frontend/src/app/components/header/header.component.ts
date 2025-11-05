import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule],
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <div class="toolbar-content">
        <a routerLink="/home" class="logo">
          <mat-icon>event</mat-icon>
          <span>EventHub</span>
        </a>
        
        <div class="nav-links">
          <a mat-button routerLink="/home" routerLinkActive="active">Home</a>
          <a mat-button routerLink="/events" routerLinkActive="active">Events</a>
          
          <ng-container *ngIf="authService.isAuthenticated()">
            <a mat-button routerLink="/my-events" routerLinkActive="active">My Events</a>
            <a mat-button routerLink="/my-bookings" routerLinkActive="active">My Bookings</a>
            <a *ngIf="authService.isAdmin()" mat-button routerLink="/create-event" routerLinkActive="active">Create Event</a>
          </ng-container>

          <a *ngIf="isOnAdmin" mat-raised-button color="accent" [routerLink]="['/create-event']" [queryParams]="{ admin: true }">
            Create Event
          </a>
        </div>
        
        <div class="user-actions">
          <ng-container *ngIf="!authService.isAuthenticated(); else userMenu">
            <button mat-raised-button color="accent" [matMenuTriggerFor]="letsGoMenu">
              Let's go
            </button>
            <mat-menu #letsGoMenu="matMenu">
              <button mat-menu-item routerLink="/login">
                <mat-icon>login</mat-icon>
                <span>Login</span>
              </button>
              <button mat-menu-item routerLink="/register">
                <mat-icon>person_add</mat-icon>
                <span>Sign Up</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item routerLink="/user">
                <mat-icon>person</mat-icon>
                <span>User</span>
              </button>
              <button mat-menu-item [routerLink]="['/login']" [queryParams]="{ returnUrl: '/admin' }">
                <mat-icon>admin_panel_settings</mat-icon>
                <span>Admin</span>
              </button>
            </mat-menu>
          </ng-container>

          <ng-template #userMenu>
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>account_circle</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <div class="user-info">
                <p class="username">{{ authService.getCurrentUser()?.username }}</p>
                <p class="role">{{ authService.getCurrentUser()?.role }}</p>
              </div>
              <mat-divider></mat-divider>
              <button mat-menu-item routerLink="/user">
                <mat-icon>dashboard_customize</mat-icon>
                <span>User Dashboard</span>
              </button>
              <button mat-menu-item routerLink="/profile">
                <mat-icon>person</mat-icon>
                <span>Profile</span>
              </button>
              <button mat-menu-item *ngIf="authService.isAdmin()" routerLink="/admin">
                <mat-icon>admin_panel_settings</mat-icon>
                <span>Admin Panel</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </ng-template>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .toolbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: 500;
      
      mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }
    }
    
    .nav-links {
      display: flex;
      gap: 8px;
    }
    
    .user-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .user-info {
      padding: 8px 16px;
      
      .username {
        margin: 0;
        font-weight: 500;
      }
      
      .role {
        margin: 0;
        font-size: 0.8rem;
        opacity: 0.7;
      }
    }
    
    .active {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
      
      .toolbar-content {
        padding: 0 8px;
      }
    }
  `]
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {}

  get isOnAdmin(): boolean {
    return this.router.url.startsWith('/admin');
  }

  logout(): void {
    this.authService.logout();
  }
}
