import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Auth {
  private userRole: string | null = null;

  private loginStatusSubject = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatusSubject.asObservable();

  constructor(private http: HttpClient) {
    if (typeof sessionStorage !== 'undefined') {
      const token = sessionStorage.getItem('jwtToken');
      this.userRole = sessionStorage.getItem('userRole');
      this.loginStatusSubject.next(this.isAuthenticated()); // emit current status
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string; email: string }>(
      'http://localhost:8083/api/auth/login',
      { email, password }
    ).pipe(
      tap(response => {
        sessionStorage.setItem('jwtToken', response.token);
        sessionStorage.setItem('email', response.email);

        // Decode token safely
        try {
          const payload = JSON.parse(atob(response.token.split('.')[1]));
          this.userRole = payload.role ?? null;
          sessionStorage.setItem('userRole', this.userRole ?? '');
        } catch {
          this.userRole = null;
          sessionStorage.removeItem('userRole');
        }

        this.loginStatusSubject.next(true); // Notify subscribers of login
      })
    );
  }

  getRole(): string {
    if (this.userRole === null && typeof sessionStorage !== 'undefined') {
      this.userRole = sessionStorage.getItem('userRole');
    }
    return this.userRole ?? '';
  }

  signup(user: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post('http://localhost:8083/api/auth/signup', user);
  }

  isAuthenticated(): boolean {
    if (typeof sessionStorage === 'undefined') {
      return false;
    }

    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp; // exp is in seconds since epoch
      const now = Math.floor(Date.now() / 1000);
      if (expiry && expiry < now) {
        // Token expired
        this.logout(); // clear token & roles
        return false;
      }
      return true;
    } catch {
      // Invalid token format
      this.logout();
      return false;
    }
  }

  logout(): void {
    this.userRole = null;

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('jwtToken');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('email');
    }

    this.loginStatusSubject.next(false); // Notify subscribers of logout
  }

  getToken(): string | null {
    if (typeof sessionStorage === 'undefined') {
      return null;
    }
    return sessionStorage.getItem('jwtToken');
  }
}
