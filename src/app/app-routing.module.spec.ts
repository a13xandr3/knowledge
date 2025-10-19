import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AppRoutingModule } from './app-routing.module';
import { ShowFileComponent } from 'src/shared/components/show-file/show-file.component';

describe('AppRoutingModule', () => {
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        AppRoutingModule
      ]
    }).compileComponents();
    router = TestBed.inject(Router);
  });

  it('should define the show-file route', () => {
    const config = router.config.find(r => r.path === 'show-file');
    expect(config).toBeDefined();
    expect(config?.component).toBe(ShowFileComponent);
  });
});