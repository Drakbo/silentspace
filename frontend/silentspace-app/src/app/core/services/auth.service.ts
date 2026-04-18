import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable, tap } from 'rxjs'
import { environment } from '../../../environments/environment'
import { AuthResponse, User } from '../../shared/models/user.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl

  // Tracks the current logged in user
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(private http: HttpClient, private router: Router) {
    // Restore user from localStorage when app loads
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    if (storedUser && storedToken) {
      this.currentUserSubject.next(JSON.parse(storedUser))
    }
  }

  // Register a new user account
  register(data: {
    first_name: string
    last_name: string
    email: string
    password: string
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register`, data).pipe(
      tap(response => this.storeAuthData(response))
    )
  }

  // Login with email and password
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, { email, password }).pipe(
      tap(response => this.storeAuthData(response))
    )
  }

  // Logout and clear stored data
  logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    this.currentUserSubject.next(null)
    this.router.navigate(['/login'])
  }

  // Get the stored JWT token
  getToken(): string | null {
    return localStorage.getItem('token')
  }

  // Check if a user is currently logged in
  isLoggedIn(): boolean {
    return !!this.getToken()
  }

  // Check if current user is admin
  isAdmin(): boolean {
    const user = this.currentUserSubject.value
    return user?.user_type_id === 2
  }

  // Get current user value
  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }

  // Store token and user in localStorage after login or register
  private storeAuthData(response: AuthResponse): void {
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    this.currentUserSubject.next(response.user)
  }
}