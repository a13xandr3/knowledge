import { TestBed } from '@angular/core/testing';
import { AppModule } from './app.module';

describe('AppModule', () => {
  it('should instantiate the AppModule', () => {
    const module = new AppModule();
    expect(module).toBeTruthy();
  });

  it('should compile through the Angular testing infrastructure', async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule]
    }).compileComponents();
    expect(true).toBeTrue();
  });
});