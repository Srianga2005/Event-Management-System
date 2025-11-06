import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest, User, UserRole } from '../models/user.model';
import { environment } from '../../environments/environment';

interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  [key: string]: any;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private tokenRefreshInProgress = false;
  private refreshTokenTimeout: any;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    this.loadUserFromStorage();
    // Setup token refresh if needed
    const token = this.getToken();
    if (token) {
      this.startTokenRefreshTimer();
    }
  }

  login(credentials: LoginRequest, isAdmin: boolean = false): Observable<AuthResponse> {
    const endpoint = isAdmin ? `${this.apiUrl}/auth/admin/signin` : `${this.apiUrl}/auth/signin`;
    
    return this.http.post<AuthResponse>(endpoint, credentials).pipe(
      tap({
        next: (response) => this.handleAuthentication(response, isAdmin),
        error: (error) => this.handleError('Login failed', error)
      })
    );
  }

  private handleAuthentication(response: AuthResponse, isAdmin: boolean = false): void {
    const rawToken = response.accessToken || (response as any)?.token;
    
    if (!rawToken) {
      throw new Error('No authentication token received');
    }

    this.setToken(rawToken);
    
    const user: User = {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName || '',
      lastName: response.lastName || '',
      role: this.normalizeRole(response.roles?.[0]),
      createdAt: response.createdAt || new Date().toISOString(),
      updatedAt: response.updatedAt || new Date().toISOString()
    };
    
    if (isAdmin && user.role !== 'ADMIN') {
      this.logout();
      throw new Error('Admin access required');
    }
    
    this.setCurrentUser(user);
    this.startTokenRefreshTimer();
  }

  private normalizeRole(role?: string): UserRole {
    if (!role) return UserRole.USER;
    const normalizedRole = role.replace('ROLE_', '').toUpperCase();
    return (Object.values(UserRole).includes(normalizedRole as UserRole)
      ? normalizedRole as UserRole 
      : UserRole.USER);
  }
  
  adminLogin(credentials: LoginRequest): Observable<AuthResponse> {
    return this.login(credentials, true);
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, userData);
  }

  logout(): void {
    this.clearAuthData();
    this.stopTokenRefreshTimer();
    this.currentUserSubject.next(null);
    // Optional: Notify other services/components about logout
    // this.router.navigate(['/login']);
  }

  private clearAuthData(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private isTokenExpired(token: string | null): boolean {
    if (!token) return true;
    
    try {
      const payload = this.decodeToken(token);
      if (!payload) return true;
      
      const expSec = payload.exp;
      if (!expSec) return true; // If no expiration, consider it expired for security
      
      const nowSec = Math.floor(Date.now() / 1000);
      const buffer = 30; // 30 seconds buffer for clock skew
      
      return expSec <= (nowSec - buffer);
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    const isExpired = this.isTokenExpired(token);
    if (isExpired) {
      // Consider automatic token refresh here if needed
      return false;
    }
    
    return !!this.getCurrentUser();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  isOrganizer(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ORGANIZER' || this.isAdmin();
  }

  hasRole(role: UserRole | UserRole[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  }

  private startTokenRefreshTimer(): void {
    const token = this.getToken();
    if (!token) return;

    const payload = this.decodeToken(token);
    if (!payload?.exp) return;

    // Refresh token when it has 5 minutes left
    const expiresInMs = (payload.exp * 1000) - Date.now() - (5 * 60 * 1000);
    
    this.stopTokenRefreshTimer();
    
    if (expiresInMs > 0) {
      this.refreshTokenTimeout = setTimeout(
        () => this.refreshToken().subscribe(),
        expiresInMs
      );
    }
  }

  private stopTokenRefreshTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  private refreshToken(): Observable<AuthResponse> {
    if (this.tokenRefreshInProgress) {
      return new Observable(observer => {
        // Wait for the in-progress refresh to complete
        const subscription = this.currentUser$.subscribe({
          next: () => {
            subscription.unsubscribe();
            observer.complete();
          },
          error: (err) => {
            subscription.unsubscribe();
            observer.error(err);
          }
        });
      });
    }

    this.tokenRefreshInProgress = true;
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/refresh`, {}).pipe(
      tap({
        next: (response) => this.handleAuthentication(response),
        error: (error) => {
          this.tokenRefreshInProgress = false;
          this.logout();
        }
      }),
      catchError(error => {
        this.tokenRefreshInProgress = false;
        return throwError(() => error);
      })
    );
  }

  private handleError(operation: string, error: any): Observable<never> {
    let errorMessage = `Error during ${operation}`;
    
    if (error instanceof HttpErrorResponse) {
      errorMessage = error.error?.message || error.message || error.statusText;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    console.error(`${operation} failed:`, error);
    return throwError(() => new Error(errorMessage));
  }

  private loadUserFromStorage(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      if (this.isTokenExpired(token)) {
        this.logout();
        return;
      }

      const payload = this.decodeToken(token);
      const storedUser = this.getStoredUser();
      
      if (storedUser) {
        this.currentUserSubject.next(storedUser);
        return;
      }

      // Fallback to token claims if no stored user
      if (payload) {
        const userFromToken: User = {
          id: Number(payload.sub) || 0,
          username: payload.sub || '',
          email: payload.email || '',
          firstName: payload.firstName || '',
          lastName: payload.lastName || '',
          role: this.normalizeRole(payload.roles?.[0]),
          createdAt: payload['createdAt'] || new Date().toISOString(),
          updatedAt: payload['updatedAt'] || new Date().toISOString()
        };
        this.setCurrentUser(userFromToken);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      this.logout();
    }
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      // Normalize base64url to base64
      let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if missing
      const pad = base64.length % 4;
      if (pad) {
        base64 += '='.repeat(4 - pad);
      }
      return JSON.parse(atob(base64));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }
}
