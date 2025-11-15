import { Injectable } from '@angular/core';
import { LoginPayload } from './auth.service';
import { CryptoService } from './crypto.service';
import { from, map, Observable, of } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class TokenStorageService {

  private readonly TOKEN_KEY = 'tknA';
  private readonly CREDS_KEY = 'tknB';

  constructor(
    private cryptoService: CryptoService
  ) {}

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.CREDS_KEY);
  }
  /** Guarda credenciais criptografadas */
  setCredentials(creds: LoginPayload): Observable<void> {
    debugger
    return from(this.cryptoService.cryptoToken(JSON.stringify(creds))).pipe(
      map((cypher) => {
        localStorage.setItem(this.CREDS_KEY, cypher);
      })
    );
  }
  /** Recupera credenciais descriptografadas */
  getCredentials(): Observable<LoginPayload | null> {
    const cypherToken = localStorage.getItem(this.CREDS_KEY);
    if (!cypherToken) return of(null);
    return from(this.cryptoService.decryptToken(cypherToken)).pipe(
      map((token) => (token ? JSON.parse(token) : null))
    );
  }
  /** Remove credenciais */
  clearCredentials(): void {
    localStorage.removeItem(this.CREDS_KEY);
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