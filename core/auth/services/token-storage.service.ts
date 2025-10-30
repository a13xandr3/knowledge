import { Injectable } from '@angular/core';
import { LoginPayload } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {

  private readonly TOKEN_KEY = 'token';
  private readonly CREDS_KEY = 'creds';

  getToken(): string | null {
    return localStorage.getItem('TOKEN_KEY');
  }

  setToken(token: string): void {
    localStorage.setItem('TOKEN_KEY', token);
  }

  clear(): void {
    localStorage.removeItem('TOKEN_KEY');
  }

  // Guarda as credenciais do login inicial (email + hash)
  setCredentials(creds: LoginPayload): void {
    localStorage.setItem(this.CREDS_KEY, JSON.stringify(creds));
  }
  
  getCredentials(): LoginPayload | null {
    const data = localStorage.getItem(this.CREDS_KEY);
    return data ? JSON.parse(data) : null;
  }

  getExpirationDate(): Date | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // exp vem em segundos → converter para ms
      const expMs = payload.exp * 1000;
      return new Date(expMs);
    } catch {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const exp = this.getExpirationDate();
    return !exp || Date.now() >= exp.getTime();
  }

  // NOVO: verifica se faltam menos de X segundos para expirar
  willExpireIn_(seconds: number): boolean {
    const exp = this.getExpirationDate();
    if (!exp) return true;
    const now = Date.now();
    const remainingMs = exp.getTime() - now;
    return remainingMs <= seconds * 1000;
  }

  willExpireIn(seconds: number): boolean {
    const exp = this.getExpirationDate();
    if (!exp) return true;
    return exp.getTime() - Date.now() <= seconds * 1000;
  }
  
}