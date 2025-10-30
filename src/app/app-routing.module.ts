import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ShowFileComponent } from 'src/shared/components/show-file/show-file.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from 'core/auth/services/auth.guard';
import { LoginComponent } from 'core/auth/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'show-file', component: ShowFileComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes , { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}