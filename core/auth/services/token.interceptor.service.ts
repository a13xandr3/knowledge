import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { TokenStorageService } from './token-storage.service';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  /**
    verificar ausência de token → tenta renovar;
    verificar se faltam ≤ 60 segundos → renova automaticamente antes de enviar a requisição.
  */

  private isRefreshing = false;

  constructor(
    private tokenStorage: TokenStorageService,
    private auth: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const token = this.tokenStorage.getToken();

    // Caso 1: Token ausente → tenta renovar (se possível)
    if (!token && !this.isRefreshing) {
      console.warn('[Interceptor] Token ausente — tentando renovar');
      return this.handleTokenRefresh(req, next);
    }

    // Caso 2: Token prestes a expirar (≤ 60s)
    if (token && this.tokenStorage.willExpireIn(60) && !this.isRefreshing) {
      console.warn('[Interceptor] Token próximo da expiração — renovando');
      return this.handleTokenRefresh(req, next);
    }

    // Token válido → adiciona header Authorization
    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(
      catchError(err => {
        if (err.status === 401) {
          console.warn('[Interceptor] 401 detectado — redirecionando para login');
          this.tokenStorage.clear();
          this.router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }

  // Regenera token usando credenciais armazenadas
  private handleTokenRefresh(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.isRefreshing = true;
    const creds = this.tokenStorage.getCredentials();
    if (!creds) {
      console.warn('[Interceptor] Nenhuma credencial salva — redirecionando para login');
      this.tokenStorage.clear();
      this.router.navigate(['/login']);
      return throwError(() => new Error('Sem credenciais para renovar token'));
    }
    return this.auth.login(creds).pipe(
      switchMap((response: any) => {
        this.isRefreshing = false;
        const newToken = response.token;
        this.tokenStorage.setToken(newToken);
        const clonedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${newToken}` }
        });
        console.log('[Interceptor] Token renovado — reexecutando requisição');
        return next.handle(clonedReq);
      }),
      catchError(err => {
        this.isRefreshing = false;
        console.error('[Interceptor] Falha ao renovar token', err);
        this.tokenStorage.clear();
        this.router.navigate(['/login']);
        return throwError(() => err);
      })
    );
  }

}