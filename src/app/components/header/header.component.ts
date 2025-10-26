import { SnackService } from './../../../shared/services/snack.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from '../dialog-content/dialog-content.component';
import { HomeService } from '../../../shared/services/home.service';
import { LinkStateService } from '../../../shared/state/link-state-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ICategoria } from 'src/shared/request/request';
import { SelectOption } from 'src/shared/models/select-option.model';

// Type guard para verificar se um objeto tem a estrutura esperada de tags
function isTagObject(v: any): v is { tags: unknown } {
  return v && typeof v === 'object' && Array.isArray((v as any).tags);
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  matcher = undefined; // ou um ErrorStateMatcher, se quiser
  @Output() itemSelecionadoEvent = new EventEmitter<string>();
  @Input() titulo!: string;
  @Input() totalHoras!: any;

  links: string[] = [];
  tg: string[] = [];
  statusOptionsCat: SelectOption<string>[] = [];
  statusOptionsTag: SelectOption<string>[] = [];

  selectedItemCategory: string = '';
  selectedItemTag: string = '';
  
  // valor inicial opcional
  initialValue: string | null = '';

  constructor(
    private homeService: HomeService,
    private linkStateService: LinkStateService,
    private snackService: SnackService,
    private dialog: MatDialog) {
      this.linkStateService.triggerRefresh();
    }
  ngOnInit(): void {
    this.brDate();
    this.getCategories();
    this.getTags();
    this.linkStateService.refreshLink$.subscribe(() => {
      this.getCategories();
      this.getTags();
    });
  }
  onChangeCategory(value: string) {
    let categoriaValue = `${value}_categoria`;
    this.selectedItemCategory = value;
    this.itemSelecionadoEvent.emit(categoriaValue);
  }
  onChangeTag(value: string) {
    let tagValue = `${value}_tag`;
      this.selectedItemTag = value;
      this.itemSelecionadoEvent.emit(tagValue);
  }
  onStatusChange(opt: SelectOption<string> | null): void {
    //console.log('Selecionado:', opt); // aqui você recebe o item inteiro
  }
  ISODate(dt: any): any {
    if ( dt === null || dt === '' ) return null;
    const [datePart, timePart] = dt.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');
    const dtNew = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${(second || '00').padStart(2, '0')}`;
    return dtNew;
  }
  private brDate(): any {
    const dataHoraAtual = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dia = pad(dataHoraAtual.getDate());
    const mes = pad(dataHoraAtual.getMonth() + 1); // mês começa em 0
    const ano = dataHoraAtual.getFullYear();
    const hora = pad(dataHoraAtual.getHours());
    const minuto = pad(dataHoraAtual.getMinutes());
    const segundo = pad(dataHoraAtual.getSeconds());
    const formatado = `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
    return formatado;
  }
  abrirDialog() {
    const dialogRef = this.dialog.open(DialogContentComponent, {
      width: '100vw',
      height: '100vh',
      data: {
        id: 0,
        name: '',
        uri: [],
        tag: [],
        totalHorasDia: 0,
        status: 'inclusao',
        categoria: this.selectedItemCategory,
        descricao: '',
        dataEntradaManha: this.ISODate(this.brDate()),
        dataSaidaManha: this.ISODate(this.brDate()),
        dataEntradaTarde: this.ISODate(this.brDate()),
        dataSaidaTarde: this.ISODate(this.brDate()),
        dataEntradaNoite: this.ISODate(this.brDate()),
        dataSaidaNoite: this.ISODate(this.brDate()),
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.categoria) {
        this.linkStateService.triggerRefresh();
      }
    });
  }
  getTags(): void {
    this.homeService.getTags().subscribe({
      next: (response: any) => {
        // Mantem seu item "todos" se precisar dele em outras lógicas
        // 1) Extrai somente os objetos de tag válidos
        const tagObjs = response
        .map((item: any) => item?.tag)
        .filter(isTagObject);
        // 2) Achata todos os arrays de tags e filtra valores não-strings/vazios
        const allTags = tagObjs
        .flatMap((obj: any) => obj.tags as unknown[])
        .filter((t: any): t is string => typeof t === 'string' && t.trim().length > 0);
        // 3) Remove duplicatas e ordena
        this.tg = [...new Set(allTags)] as string[];        
        this.tg.sort((a: any, b: any) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
        this.tg.unshift('todos');
        this.statusOptionsTag = (this.tg ?? []).map(cat => ({
          value: cat,
          label: cat
        }));
      },
      error: (err: HttpErrorResponse) => {
        this.snackService.mostrarMensagem(
          err.message, 'Fechar'
        );
      }
    });
  }
  getCategories(): void {
    this.homeService.getCategorias().subscribe({
      next: (response: any) => {
        const resp = response;
        this.links = [...new Set(resp?.map((r: ICategoria) => r.categoria))] as string[];        
        this.links.sort((a: any, b: any) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
        this.links.unshift('todos');
        this.statusOptionsCat = (this.links ?? []).map(cat => ({
          value: cat,
          label: cat
        }));
      },
      error: (err: HttpErrorResponse) => {
        this.snackService.mostrarMensagem(
          err.message, 'Fechar'
        );
      }
    });
  }
}