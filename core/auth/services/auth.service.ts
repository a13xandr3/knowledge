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

  login(credentials: LoginPayload): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.api}/login`, credentials).pipe(
      tap((response: any) => {
        this.tokenStorage.setToken(response.token)
      })
    );
  }

refreshToken(): Observable<{ token: string }> {
  const creds = this.tokenStorage.getCredentials();
  if (!creds) throw new Error('Não foi possível obter token, confirme com adm.');
    return this.http.post<{ token: string }>(`${this.api}/login`, creds).pipe(
      tap(response => {
        this.tokenStorage.setToken(response.token);
        console.log('Token renovado com sucesso');
      })
    );
  }

}
