import { LoginService } from 'src/shared/services/login.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'Knowledge Base';

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.login();
  }

  login(): void {
    this.loginService.login('alexandre','1234').subscribe({
      next: (response: any) => {
        //this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
      }
    });
  }
  
}
