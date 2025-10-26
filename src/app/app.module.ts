import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { DialogContentComponent } from './components/dialog-content/dialog-content.component';

import { QuillModule } from 'ngx-quill';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { AuthInterceptor } from './core/interceptors/auth.interceptor';

import { MatChipsComponent } from '../shared/components/mat-chips/mat-chips.component';
import { QuillComponent } from '../shared/components/quill/quill.component';
import { DurationPipe } from '../shared/pipe/duration.pipe';
import { HoraFormatadaPipe } from '../shared/pipe/hora-formatada.pipe';
import { ShowFileComponent } from '../shared/components/show-file/show-file.component';
import { InputFileComponent } from '../shared/components/input-file/input-file.component';
import { UploaderComponent } from '../shared/components/uploader/uploader.component';
import { SelectFieldComponent } from 'src/shared/components/select-field/select-field.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    DialogContentComponent,
    MatChipsComponent,
    QuillComponent,
    DurationPipe,
    HoraFormatadaPipe,
    ShowFileComponent,
    InputFileComponent,
    UploaderComponent,
    SelectFieldComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    NgxMaskDirective,
    NgxMaskPipe,
    QuillModule.forRoot({
      customOptions: [
        { import: 'formats/font', whitelist: ['Alumni', 'Poppins', 'Raleway'] },
        { import: 'formats/size', whitelist: ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '36px', '72px'] }
      ]
    }),
    ReactiveFormsModule,
  ],
  exports: [MatChipsComponent],
  providers: [
    provideNgxMask(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }