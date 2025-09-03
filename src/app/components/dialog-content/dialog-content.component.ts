import { SnackService } from './../../../shared/services/snack.service';
import { DatePipe } from '@angular/common';
import { 
  AfterViewInit, 
  Component, 
  ElementRef, 
  Inject, 
  OnDestroy, 
  OnInit, 
  Optional, 
  ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

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
export class DialogContentComponent {

  separatorKeysCodes: number[] = [ENTER, COMMA];  //chip
  
  allTags: string[] = [];                         //Tags
  allUris: string[] = [];                          //Uri
  
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  @ViewChild('uriInput') uriInput!: ElementRef<HTMLInputElement>;

  fr: FormGroup;
  
  exibeSite: any;
  safeUrl: SafeResourceUrl | undefined;
  currentContent = '';

  constructor(
    private service: HomeService,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogContentComponent>,
    private linkStateService: LinkStateService,
    private datePipe: DatePipe,
    private SnackService: SnackService) 
  {

    this.fr = this.fb.group({
      id: [{ value: data?.id || '', disabled: true }],
      name: [data?.name],
      url: [data?.url],
      uri: [this.normalizeUris(data)],
      tag: [this.normalizeTags(data)],
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
  private normalizeTags(data: any): string[] {
    return Array.isArray(data?.tag?.[0]?.tags)
      ? data.tag[0].tags.map((t: any) =>
        typeof t === 'string' ? t : (t.value ?? t.tag ?? String(t)))
      : [];
  }
  private normalizeUris(data: any): string[] {
    return Array.isArray(data?.uri?.[0]?.uris)
      ? data.uri[0].uris.map((u: any) =>
          typeof u === 'string' ? u : (u.value ?? u.uri ?? String(u)))
      : [];
  }

  fechar() {
    this.dialogRef.close();
  }
  
  salvar(): void {
    if (!this.fr.valid) return;
    const dados = this.fr.getRawValue();
    const isInclusao = this.data.status === 'inclusao';
    this.salvarOuAtualizar(dados, isInclusao);
    this.dialogRef.close(dados);
  }

  private salvarOuAtualizar(request: ILinkRequest, isInclusao: boolean): void {
    const auxRequest = this.buildRequest(request);
    const call$ = isInclusao
      ? this.service.postLink(auxRequest)
      : this.service.putLink(auxRequest);
    call$?.subscribe({
      next: () => {
        this.mostrarMensagem(
          isInclusao ? 'Card Inserido com sucesso!' : 'Card Atualizado com sucesso!',
          'Fechar'
        );
        this.linkStateService.triggerRefresh();
      },
      error: err => console.error(err)
    });
  }
  private buildRequest(request: ILinkRequest) {
    const isTimesheet = request.categoria?.toLowerCase() === 'timesheet';
    const toISO = (dt: any) => isTimesheet ? this.ISODate(dt) : null;
    return {
      id: request.id,
      name: request.name,
      url: request.url,
      uri: { uris: this.allUris },
      categoria: request.categoria ? this.toTitleCase(request.categoria) : '',
      subCategoria: request.subCategoria ? this.toTitleCase(request.subCategoria) : '',
      descricao: request.descricao,
      tag: { tags: this.allTags },
      dataEntradaManha: toISO(request?.dataEntradaManha),
      dataSaidaManha: toISO(request?.dataSaidaManha),
      dataEntradaTarde: toISO(request?.dataEntradaTarde),
      dataSaidaTarde: toISO(request?.dataSaidaTarde),
      dataEntradaNoite: toISO(request?.dataEntradaNoite),
      dataSaidaNoite: toISO(request?.dataSaidaNoite)
    };
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
      next: (() => {
        this.mostrarMensagem('Card Inserido com sucesso!', 'Fechar');
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
      next: (() => {
        this.mostrarMensagem('Card Atualizado com sucesso!', 'Fechar');
        this.linkStateService.triggerRefresh();
      }),
      error: (err => {
        console.log(err);
      })
    })
  }
  mostrarMensagem(msg: string, action: any): void {
    this.SnackService.mostrarMensagem(msg, action);
  }

}