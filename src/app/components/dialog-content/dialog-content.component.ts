import { LinkMapperService } from './../../../shared/services/link-mapper.service';
import { SnackService } from './../../../shared/services/snack.service';
import { 
  Component, 
  ElementRef, 
  Inject, 
  OnInit, 
  Optional, 
  ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { LinkStateService } from '../../../shared/state/link-state-service';
import { HomeService } from '../../../shared/services/home.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/shared/services/login.service';
@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss'],
  providers: [DatePipe]
})
export class DialogContentComponent implements OnInit {

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
    private linkMapperService: LinkMapperService,
    private snackService: SnackService,
    private loginService: LoginService
  ) 
  {
    console.log('data ==> ', data);
    this.fr = this.fb.group({
      id: [{ value: data?.id || '', disabled: true }],
      name: [data?.name],
      url: [data?.url],
      uri: [this.linkMapperService.normalizeUris(data)],
      tag: [this.linkMapperService.normalizeTags(data)],
      categoria: [data?.categoria],
      subCategoria: [data?.subCategoria],
      descricao: [data?.descricao || ''],
      oldCategoria: [data?.oldCategoria],
      status: [data?.status],
      dataEntradaManha: [this.linkMapperService.toDateBr(data?.dataEntradaManha)],
      dataSaidaManha: [this.linkMapperService.toDateBr(data?.dataSaidaManha)],
      dataEntradaTarde: [this.linkMapperService.toDateBr(data?.dataEntradaTarde)],
      dataSaidaTarde: [this.linkMapperService.toDateBr(data?.dataSaidaTarde)],
      dataEntradaNoite: [this.linkMapperService.toDateBr(data?.dataEntradaNoite)],
      dataSaidaNoite: [this.linkMapperService.toDateBr(data?.dataSaidaNoite)]
    });
  }
  ngOnInit(): void {
  }
  fechar() {
    this.dialogRef.close();
  }
  salvar(): void {
    if (!this.fr.valid) return;
    const dados = this.fr.getRawValue();
    const isInclusao = this.data.status === 'inclusao';
    const auxRequest = this.linkMapperService.buildRequest(dados, this.allTags, this.allUris);
    const call$ = isInclusao
      ? this.service.postLink(auxRequest)
      : this.service.putLink(auxRequest);
    call$?.subscribe({
      next: () => {
        this.snackService.mostrarMensagem(
          isInclusao ? 'Card Inserido com sucesso!' : 'Card Atualizado com sucesso!', 'Fechar'
        );
        this.linkStateService.triggerRefresh();
        this.dialogRef.close(dados);
      },
      error: err => console.error(err)
    });
  }
  onChipClick(event: MouseEvent): void {
    const target = event.srcElement as HTMLElement;
    const url = target?.innerText;
    if (url) {
      const tempAnchor = document.createElement('a');
      tempAnchor.href = url;
      tempAnchor.target = '_blank';
      tempAnchor.click();
    }
  }
}