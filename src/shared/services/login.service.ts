import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url = 'http://localhost:8081/api/auth/login';
  
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(this.url, { username, password })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('token', response.token); // salva token no navegador
        })
      );
  }
}