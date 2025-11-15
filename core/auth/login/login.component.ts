import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { catchError, from, of, switchMap, tap } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { TwofaService } from '../services/twofa.service';
import { TokenStorageService } from '../services/token-storage.service';
import { CryptoService } from '../services/crypto.service';

import { SnackService } from 'src/shared/services/snack.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  step2fa = false;
  twofaCode = '';

  titulo = 'Knowledge Base';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private tokenStorage: TokenStorageService,
    private cryptoService: CryptoService,
    private twofa: TwofaService,
    private router: Router,
    private snackService: SnackService
  ) {}

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)]],
    totp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    debugger;
    if (this.loginForm.invalid) return;
    
    const username = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;
    const totp = this.loginForm.value.totp!;

    this.auth.login({ username, password, totp }).pipe(
      tap(() =>
        this.router.navigate(['/home'], {
          queryParams: { titulo: this.titulo }
        })
      ),
      catchError((err) => {
        this.snackService.mostrarMensagem('Login e/ou Senha incorreto', 'Fechar');
        console.error('[Login Error]', err);
        return of(null);
      })
    ).subscribe();

    /*
    from(this.cryptoService.cryptoHashPassword(password))
      .pipe(
        switchMap((passwordHash) => {
          debugger;
          const credentials = { username, password: passwordHash };
          return this.tokenStorage.setCredentials(credentials).pipe(
            switchMap(() => this.auth.login(credentials))
          );
        }),
        tap(() =>
          this.router.navigate(['/home'], {
            queryParams: { titulo: this.titulo }
          })
        ),
        catchError((err) => {
          this.snackService.mostrarMensagem('Login e/ou Senha incorreto', 'Fechar');
          console.error('[Login Error]', err);
          return of(null);
        })
      )
      .subscribe();
    */
  }
  
  /*
  verify2fa() {
    this.twofa.verify(this.email?.value!, this.twofaCode).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err: any) => console.error('Erro no 2FA:', err),
    });
  }
  */

}