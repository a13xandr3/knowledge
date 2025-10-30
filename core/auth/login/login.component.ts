import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { TwofaService } from '../services/twofa.service';
import { Router } from '@angular/router';
import { SHA256, enc } from 'crypto-js';
import { TokenStorageService } from '../services/token-storage.service';
import * as CryptoJS from 'crypto-js';
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
    private twofa: TwofaService,
    private router: Router,
    private snackService: SnackService
  ) {}

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)]],
  });

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const username = this.loginForm.value.email!;
    const passwordHash = CryptoJS.SHA256(this.loginForm.value.password!).toString(CryptoJS.enc.Hex);

    const credentials = { username, password: passwordHash };

    this.tokenStorage.setCredentials(credentials);

    this.auth.login(credentials).subscribe({
      next: () => this.router.navigate(['/home'], { queryParams: { titulo: this.titulo  }}),
      error: (err) => this.snackService.mostrarMensagem('Login e/ou Senha incorreto', 'Fechar')
    });
  }

  onSubmit_() {
    if (this.loginForm.invalid) return;

    const hashedPassword = SHA256(this.password?.value!).toString(enc.Hex);

    const payload = {
      username: this.email?.value!,
      password: hashedPassword,
    };

    this.auth.login({username: payload.username, password: payload.password}).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err: any) => console.error('Falha no login:', err)
    });
  }

  verify2fa() {
    this.twofa.verify(this.email?.value!, this.twofaCode).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err: any) => console.error('Erro no 2FA:', err),
    });
  }
}
