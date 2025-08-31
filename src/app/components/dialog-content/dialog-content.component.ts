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
import { FormBuilder, FormControl,  FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  
  ArrTags: string[] = [];                         //Tags
  allTags: string[] = [];                         //Tags
  filteredTags!: Observable<string[]>;            //Tags
  tagCtrl = new FormControl('');                  //Tags
  
  ArrUris: string[] = [];                          //Uri
  allUris: string[] = [];                          //Uri
  filteredUris!: Observable<string[]>;             //Uri
  uriCtrl = new FormControl('');                   //Uri

  //descricao: any;

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
    this.fr = this.fb.group({
      id: [{ value: data?.id || '', disabled: true }],
      name: [data?.name],
      url: [{ value: data?.url, disabled: false }],
      uri: [{ value: data?.uri, disabled: false }],
      categoria: [data?.categoria],
      subCategoria: [data?.subCategoria],
      descricao: [data?.descricao || ''],
      tg: '',
      oldCategoria: [data?.oldCategoria],
      status: [''],
      dataEntradaManha: [this.datePipe.transform(data?.dataEntradaManha, 'dd/MM/yyyy HH:mm:ss')],
      dataSaidaManha: [this.datePipe.transform(data?.dataSaidaManha, 'dd/MM/yyyy HH:mm:ss')],
      dataEntradaTarde: [this.datePipe.transform(data?.dataEntradaTarde, 'dd/MM/yyyy HH:mm:ss')],
      dataSaidaTarde: [this.datePipe.transform(data?.dataSaidaTarde, 'dd/MM/yyyy HH:mm:ss')],
      dataEntradaNoite: [this.datePipe.transform(data?.dataEntradaNoite, 'dd/MM/yyyy HH:mm:ss')],
      dataSaidaNoite: [this.datePipe.transform(data?.dataSaidaNoite, 'dd/MM/yyyy HH:mm:ss')]
    });


    //** URI */
    this.filteredUris = this.uriCtrl.valueChanges.pipe(
      startWith(null),
      map((uri: string | null) => (uri ? this._filterUri(uri) : this.allUris.slice())),
    );
    if ( this.hasUri( this.data.uri ) ) {
      data.uri[0].uris.forEach((r: any) => {
        this.ArrUris.push(r);
      });
    } else {
      console.log('Nenhuma tag encontrada');
    }


    //** TAGS */
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filterTag(tag) : this.allTags.slice())),
    );
    if ( this.hasTags( this.data.tag ) ) {
      data.tag[0].tags.forEach((r: any) => {
        this.ArrTags.push(r);
      });
    } else {
      console.log('Nenhuma tag encontrada');
    }
  }
  /**
   * Verifica se existe ao menos uma tag válida no objeto recebido.
   * @param data qualquer retorno do backend
   * @returns boolean indicando se existem tags
   */
  hasUri(data: any): boolean {
    if( !data ) {
      return false;
    }
    //case seja objeto unico
    if ( !Array.isArray(data) && Array.isArray(data.uris)) {
      return data.uris.length > 0;
    }
    // caso seja array de objetos [ {tags: [] }]
    if ( Array.isArray(data) ) {
      return data.some(item => item.uris && Array.isArray(item.uris) && item.uris.length > 0);
    }
    return false;
  }


  /**
   * Verifica se existe ao menos uma tag válida no objeto recebido.
   * @param data qualquer retorno do backend
   * @returns boolean indicando se existem tags
   */
  hasTags(data: any): boolean {
    if( !data ) {
      return false;
    }
    //case seja objeto unico
    if ( !Array.isArray(data) && Array.isArray(data.tags)) {
      return data.tags.length > 0;
    }
    // caso seja array de objetos [ {tags: [] }]
    if ( Array.isArray(data) ) {
      return data.some(item => item.tags && Array.isArray(item.tags) && item.tags.length > 0);
    }
    return false;
  }
  ngOnInit(): void {}
  async ngAfterViewInit() {
  }
  ngOnDestroy(): void {
  }
  /*
  geraThumb(): void {
    this.service.getThumbs().subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
  carregarConteudo(urlTarget: string) {
    this.service.carregaConteudo(urlTarget).subscribe({
      next: (data: any) => {
        let espiaNovo = document.getElementById('browser') as HTMLElement;
        espiaNovo.innerHTML = data;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
  */
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
      uri: {"uris": this.ArrUris},
      categoria: request.categoria != null ? this.toTitleCase(request.categoria) : '',
      subCategoria: request.subCategoria != null ? this.toTitleCase(request.subCategoria) : '',
      descricao: request.descricao,
      tag: {"tags": this.ArrTags},
      dataEntradaManha: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataEntradaManha) : null,
      dataSaidaManha: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataSaidaManha) : null,
      dataEntradaTarde: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataEntradaTarde) : null,
      dataSaidaTarde: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataSaidaTarde) : null,
      dataEntradaNoite: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataEntradaNoite) : null,
      dataSaidaNoite: request.categoria.toLowerCase() == 'timesheet' ? this.ISODate(request?.dataSaidaNoite) : null
    }
    this.service.postLink(auxRequest).subscribe({
      next: ((resp: any) => {
        console.log(resp);
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
      uri: {"uris": this.ArrUris},
      categoria: request.categoria != null ? this.toTitleCase(request.categoria) : '',
      subCategoria: request.subCategoria != null ? this.toTitleCase(request.subCategoria) : '',
      descricao: request.descricao,
      tag: {"tags": this.ArrTags},
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



  //** TAG */
  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.ArrTags.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.tagCtrl.setValue(null);
  }
  removeTag(chip: string): void {
    const index = this.ArrTags.indexOf(chip);
    if (index >= 0) {
      this.ArrTags.splice(index, 1);
    }
  }
  tagSelected(event: MatAutocompleteSelectedEvent): void {
    this.ArrTags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }
  private _filterTag(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }



  //** URI */
  addUri(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.ArrUris.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.uriCtrl.setValue(null);
  }
  removeUri(chip: string): void {
    const index = this.ArrUris.indexOf(chip);
    if (index >= 0) {
      this.ArrUris.splice(index, 1);
    }
  }
  uriSelected(event: MatAutocompleteSelectedEvent): void {
    this.ArrUris.push(event.option.viewValue);
    this.uriInput.nativeElement.value = '';
    this.uriCtrl.setValue(null);
  }
  private _filterUri(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allUris.filter(uri => uri.toLowerCase().includes(filterValue));
  }

}