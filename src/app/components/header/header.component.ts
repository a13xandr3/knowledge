import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from '../dialog-content/dialog-content.component';
import { HomeService } from '../../../shared/services/home.service';
import { ILinkRequest } from 'src/shared/request/request';
import { LinkStateService } from '../../../shared/state/link-state-service';
import { ILinksResponse } from 'src/shared/response/response';
export interface ICategoria {
  id: number;
  categoria: string;
}
export interface ITag {
  id: number;
  tag: any;
}
function isTagObject(v: any): v is { tags: unknown } {
  return v && typeof v === 'object' && Array.isArray((v as any).tags);
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() itemSelecionadoEvent = new EventEmitter<string>();
  @Input() titulo!: string;
  public links: string[] = [];
  public tg: string[] = [];
  public selectedItemCategory: string = '';
  public selectedItemTag: string = '';
  constructor(
    private homeService: HomeService,
    private linkStateService: LinkStateService,
    private dialog: MatDialog) {
      this.linkStateService.triggerRefresh();
    }
  ngOnInit(): void {
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
  abrirDialog() {
    const dialogRef = this.dialog.open(DialogContentComponent, {
      width: '100vw',
      height: '100vh',
      data: {
        id: 0,
        name: '',
        url: '',
        status: 'inclusao',
        categoria: '',
        descricao: '',
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
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
  getCategories(): void {
    this.homeService.getCategorias().subscribe({
      next: (response: any) => {
        const resp = response;
        this.links = [...new Set(response.map((r: ICategoria) => r.categoria))] as string[];        
        this.links.sort((a: any, b: any) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
        this.links.unshift('todos');
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}