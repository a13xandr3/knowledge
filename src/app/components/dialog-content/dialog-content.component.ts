import { DatePipe } from '@angular/common';
import { 
  AfterViewInit, 
  Component, 
  ElementRef, 
  Inject, 
  NgZone, 
  OnDestroy, 
  OnInit, 
  Optional, 
  ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { LinkStateService } from '../../../shared/state/link-state-service';
import { HomeService } from '../../../shared/services/home.service';
import { ILinkRequest } from 'src/shared/request/request';
@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss'],
  providers: [DatePipe]
})
export class DialogContentComponent implements OnInit, AfterViewInit, OnDestroy {
  separatorKeysCodes: number[] = [ENTER, COMMA];  //chip
  
  allTags: string[] = [];                         //Tags
  allUris: string[] = [];                          //Uri
  
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  @ViewChild('uriInput') uriInput!: ElementRef<HTMLInputElement>;

  fr: FormGroup;
  showSite = false;
  exibeSite: any;
  safeUrl: SafeResourceUrl | undefined;
  currentContent = '';
  constructor(
    private service: HomeService,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DialogContentComponent>,
    private sanitizer: DomSanitizer,
    private linkStateService: LinkStateService,
    private zone: NgZone,
    private datePipe: DatePipe) 
  {
    this.showSite = data.showSite;

    //** normalize o data de entrada antes de criar o FormGroup */
    const normTags = (() => {
      if (!this.data) return [];
      if (Array.isArray(this.data?.tag[0]?.tags)) return this.data?.tag[0]?.tags.map((t: any) => typeof t === 'string' ? t : (t.value ?? t.tag ?? String(t)));
      if (this.data?.tag[0] && Array.isArray(this.data?.tag[0]?.tags)) return this.data?.tag[0]?.tags.map((t: any) => typeof t === 'string' ? t : (t.value ?? t.tag ?? String(t)));
      return [];
    })();
    const normUris = (() => {
      if (!this.data) return [];
      if (Array.isArray(this.data?.uri[0]?.uris)) return this.data?.uri[0]?.uris.map((u: any) => typeof u === 'string' ? u : (u.value ?? u.uri ?? String(u)));
      if (this.data?.uri[0] && Array.isArray(this.data?.uri[0]?.uris)) return this.data?.uri[0]?.uris.map((u: any) => typeof u === 'string' ? u : (u.value ?? u.uri ?? String(u)));
      return [];
    })();

    /*
    Array.isArray(data?.uris?.uri) 
              ? data?.uris?.uri?.map((u: any) => typeof u === 'string' ? u : u.value) 
              : (data?.uris?.uri ? [data.uris] : [])

    Array.isArray(data?.tag?.tags) 
              ? data?.tag?.tags?.map((t: any) => typeof t === 'string' ? t : t.value) 
              : (data?.tag?.tags ? [data.tag.tags] : [])          
    */

    this.fr = this.fb.group({
      id: [{ value: data?.id || '', disabled: true }],
      name: [data?.name],
      url: [data?.url],
      uri: [normUris],
      tag: [normTags],
      categoria: [data?.categoria],
      subCategoria: [data?.subCategoria],
      descricao: [data?.descricao || ''],
      oldCategoria: [data?.oldCategoria],
      status: [''],
      dataEntradaManha: [this.datePipe.transform(data?.dataEntradaManha, 'dd/MM/yyyy HH:mm:ss')],
      dataSaidaManha: [this.datePipe.transform(data?.dataSaidaManha, 'dd/MM/yyyy HH:mm:ss')],
      dataEntradaTarde: [this.datePipe.transform(data?.dataEntradaTarde, 'dd/MM/yyyy HH:mm:ss')],
      dataSaidaTarde: [this.datePipe.transform(data?.dataSaidaTarde, 'dd/MM/yyyy HH:mm:ss')],
      dataEntradaNoite: [this.datePipe.transform(data?.dataEntradaNoite, 'dd/MM/yyyy HH:mm:ss')],
      dataSaidaNoite: [this.datePipe.transform(data?.dataSaidaNoite, 'dd/MM/yyyy HH:mm:ss')]
    });
  }
  ngOnInit(): void {}
  async ngAfterViewInit() {}
  ngOnDestroy(): void {}
  fechar() {
    this.dialogRef.close();
  }
  salvar(): void {
    if (this.fr.valid) {
      const dados = this.fr.getRawValue();
      if(this.data.status === 'inclusao') {
        this.postSalvar(dados);
      } else {
        this.putAtualizar(dados);
      }
      this.dialogRef.close(dados);
    }
  }
  toTitleCase(str: string): string {
    return str
      .toLowerCase()                                              // deixa tudo minúsculo primeiro (opcional, mas comum)
      .split(' ')                                                 // separa em palavras
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // primeira letra maiúscula
      .join(' ');                                                 // junta de novo
  }
  postSalvar(request: ILinkRequest): void {
    const auxRequest = {
      id: request.id,
      name: request.name,
      url: request.url,
      uri: {"uris": this.allUris},
      categoria: request.categoria != null ? this.toTitleCase(request.categoria) : '',
      subCategoria: request.subCategoria != null ? this.toTitleCase(request.subCategoria) : '',
      descricao: request.descricao,
      tag: {"tags": this.allTags},
      dataEntradaManha: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataEntradaManha) : null,
      dataSaidaManha: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataSaidaManha) : null,
      dataEntradaTarde: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataEntradaTarde) : null,
      dataSaidaTarde: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataSaidaTarde) : null,
      dataEntradaNoite: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataEntradaNoite) : null,
      dataSaidaNoite: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataSaidaNoite) : null
    }
    this.service.postLink(auxRequest).subscribe({
      next: ((resp: any) => {
        this.mostrarMensagem('Card Inserido com sucesso!');
        this.linkStateService.triggerRefresh();
      }),
      error: (err => {
        console.log(err);
      })
    })
  }
  ISODate(dt: any): any {
    if ( dt === null || dt === '' ) return null;
    const [datePart, timePart] = dt.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');
    const dtNew = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${(second || '00').padStart(2, '0')}`;
    return dtNew;
  }
  putAtualizar(request: ILinkRequest): void {
    const auxRequest = {
      id: request.id,
      name: request.name,
      url: request.url,
      uri: {"uris": this.allUris},
      categoria: request.categoria != null ? this.toTitleCase(request.categoria) : '',
      subCategoria: request.subCategoria != null ? this.toTitleCase(request.subCategoria) : '',
      descricao: request.descricao,
      tag: {"tags": this.allTags},
      dataEntradaManha: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataEntradaManha) : null,
      dataSaidaManha: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataSaidaManha) : null,
      dataEntradaTarde: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataEntradaTarde) : null,
      dataSaidaTarde: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataSaidaTarde) : null,
      dataEntradaNoite: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataEntradaNoite) : null,
      dataSaidaNoite: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataSaidaNoite) : null
    }
    this.service.putLink(auxRequest)?.subscribe({
      next: ((resp: any) => {
        this.mostrarMensagem('Card Atualizado com sucesso!');
        this.linkStateService.triggerRefresh();
      }),
      error: (err => {
        console.log(err);
      })
    })
  }
  mostrarMensagem(msg: string): void {
    this.snackBar.open(msg, 'Fechar', {
      duration: 5000,                 // em milissegundos
      verticalPosition: 'top',        // ou 'bottom'
      horizontalPosition: 'right'     // ou 'left', 'center'
    });
  }
}