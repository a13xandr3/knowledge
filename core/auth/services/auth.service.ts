import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { TokenStorageService } from './token-storage.service';

export interface LoginPayload {
  username: string;
  password: string; // hash
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = 'http://localhost:8081/api/auth';

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) {}

  login_(data: { username: string; password: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.api}/login`, data).pipe(
      tap(response => localStorage.setItem('token', response.token))
    );
  }

  login(credentials: LoginPayload): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.api}/login`, credentials).pipe(
      tap(response => this.tokenStorage.setToken(response.token))
    );
  }

  refreshToken_(): Observable<any> {
    const token = localStorage.getItem('token');

    // CASO 1: Token inexistente → não tenta renovar
    if (!token) {
      console.warn('[AuthService] Token inexistente — redirecionando para login');
      return throwError(() => new Error('Token inexistente para renovar.'));
    }

    // CASO 2: Token existe → tenta renovar normalmente
    return this.http.post<{ token: string }>('http://localhost:8081/api/auth/refresh', { token }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        console.log('[AuthService] Token renovado com sucesso');
      })
    );
  }

refreshToken(): Observable<{ token: string }> {
    const creds = this.tokenStorage.getCredentials();
    if (!creds) throw new Error('Credenciais ausentes — impossível renovar token.');

    return this.http.post<{ token: string }>(`${this.api}/login`, creds).pipe(
      tap(response => {
        this.tokenStorage.setToken(response.token);
        console.log('[AuthService] Token renovado com sucesso');
      })
    );
  }

}
