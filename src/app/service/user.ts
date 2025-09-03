import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from '../model/profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8083/api/profile'; 
  
  constructor(private http: HttpClient) {}

  private getUserEmail(): string {
    return sessionStorage.getItem('email') || '';
  }

  getUser(email: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}?email=${email}`);
  }

  updateProfile(email: string, profile: UserProfile): Observable<any> {
  const token = sessionStorage.getItem('jwtToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  return this.http.put(`${this.apiUrl}/${profile.email}`, profile, {
    headers,
    responseType: 'text'
  });
}
}
