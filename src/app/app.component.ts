import { LoginService } from 'src/shared/services/login.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'Knowledge Base';

  constructor(
    private router: Router,
    private loginService: LoginService) {}

  ngOnInit() {
    //this.login();
  }

  /*
  login(): void {
    //'alexandre','1234'
    this.loginService.login('alexandre','1234').subscribe({
      next: (response: any) => {
        this.router.navigate(['/home'], {
          queryParams: { titulo: this.title }
        });
      },
      error: (err: any) => {
      }
    });
  }
  */
 
}
