import { Injectable } from '@angular/core';
import { LoginPayload } from './auth.service';
import * as CryptoJS from 'crypto-js';
@Injectable({ providedIn: 'root' })
export class TokenStorageService {

  private readonly TOKEN_KEY = 'tknA';
  private readonly CREDS_KEY = 'tknB';

  private secretKey = '8b5c3f6d9a247c8b2a74e998f0b6719d7e2f1c3e8a9b4f7d8a1d3c5e6f2a9b8e';

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Guarda as credenciais do login inicial (email + hash)
  setCredentials(creds: LoginPayload): void {
    const cypherToken = this.cryptoToken(JSON.stringify(creds));
    localStorage.setItem(this.CREDS_KEY, cypherToken);
  }
  
  getCredentials(): LoginPayload | null {
    const cypherToken = localStorage.getItem(this.CREDS_KEY);
    const token = this.decrypToken(cypherToken!);
    return token ? JSON.parse(token) : null;
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
  
  /** Criptografa dados genéricos (token, creds etc.) */
  encryptData(data: string): string {
    const encrypted = CryptoJS.AES.encrypt(data, this.secretKey).toString();
    return encrypted;
  }

  /** Descriptografa dados genéricos */
  decryptData(cipherText: string): string | null {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || null;
    } catch {
      return null;
    }
  }

  /** Criptografa token */
  cryptoToken(token: string): string {
    return this.encryptData(token);
  }

  /** Descriptografa token */
  decrypToken(cipherToken: string): string | null {
    return this.decryptData(cipherToken);
  }

  /** Criptografa credenciais (username + password base64) */
  cryptoCreds(username: string, password: string): string {
    const creds = `${username}:${btoa(password)}`; // password → base64
    return this.encryptData(creds);
  }

  /** Descriptografa credenciais */
  decryptCreds(cipherCreds: string): { username: string; password: string } | null {
    const decrypted = this.decryptData(cipherCreds);
    if (!decrypted) return null;

    const [username, passwordBase64] = decrypted.split(':');
    const password = atob(passwordBase64);
    return { username, password };
  }

}