import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ShowFileComponent } from 'src/shared/components/show-file/show-file.component';

const routes: Routes = [
  { path: 'show-file', component: ShowFileComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes , { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }