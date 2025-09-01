import { 
  AfterViewInit, 
  Component, 
  Input, 
  OnChanges, 
  OnDestroy, 
  OnInit, 
  SimpleChanges, 
  ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

import { concatMap, of, Subject, takeUntil, tap } from 'rxjs';

import { IactionStatus } from 'src/shared/request/request';
import { LinkStateService } from '../../../shared/state/link-state-service';
import { HomeService } from '../../../shared/services/home.service';
import { Comportamento, ComportamentoService } from '../../../shared/services/comportamento.service';
import { ILinksResponse } from '../../../shared/response/response';

import arquivo from '../../../assets/data/arquivo.json';
import { DialogContentComponent } from '../dialog-content/dialog-content.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  categoriaExcessao = arquivo.categoriaExcessao;
  @Input() titulo!: string;
  itemModificadoCategoria: string = '';
  itemModificadoTag: string = '';
  links: ILinksResponse[] = [];
  dataSource = new MatTableDataSource(this.links);
  comportamentos: Comportamento[] = [];
  pagedItems: ILinksResponse[] = [];
  displayedColumns: string[] = ['id','categoria', 'name', 'tag', 'actions'];
  totalLinks!: number;
  pageSize!: number;
  pageIndex!: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private destroy$ = new Subject<void>();

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private comportamentoService: ComportamentoService,
    private linkStateService: LinkStateService,
    private homeService: HomeService,
  ) {
  }
  ngOnInit(): void {
    this.executarSequencia();
  }
  ngAfterViewInit(): void {
  }
  _injectUrl(url: any): any {
    let retorno: any = '';
    let enderecoUrl = url.url || '';
    let enderecoUri = Array.isArray(url?.uri?.uris[0]) ? url?.uri?.uris[0] : '' ;
    console.log('Url', enderecoUrl);
    console.log('Uri', enderecoUri);
    if ( enderecoUrl.length == 0 ) {
      retorno = enderecoUrl;
    } else {
      retorno = enderecoUri;
    }
    return retorno;
  }
  injectUrl(url: any): string {
    const enderecoUrl = url?.url ?? ''; // string ou ''
    const enderecoUri = url?.uri?.uris?.length ? url.uri.uris[0] : ''; // primeira URI se existir

    //console.log('Url', enderecoUrl);
    //console.log('Uri', enderecoUri);

    // se url for vazio, tenta pegar o uri
    return enderecoUrl && enderecoUrl.length > 0 ? enderecoUrl : enderecoUri;
  }
  arr(_arr: any): boolean {
    if ( Array.isArray(_arr) ) {
      return true;
    }
    return false;
  }
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getLinks();
    
    this.updatePagedItems(event.pageIndex * event.pageSize, event.pageSize);
  }
  updatePagedItems(startIndex: number, pageSize: number) {
    this.pagedItems = this.links?.slice(startIndex, startIndex + pageSize);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnChanges(changes: SimpleChanges): void {
      console.log(changes);
  }
  private executarSequencia(): void {
    of(null).pipe(
      tap(() => this.resetPaginador()),
      concatMap(() => of(null).pipe(
        tap(() => this.resetPaginador()),
      )),
      tap(() => this.subscreverComportamentos()),
      concatMap(() => of(null).pipe(
        tap(() => this.subscreverComportamentos()),
      )),
      tap(() => this.subscreverAtualizacoes()),
      concatMap(() => of(null).pipe(
        tap(() => this.subscreverAtualizacoes()),
      )),
      tap(() => this.updatePagedItems(this.pageIndex, this.pageSize)),
      concatMap(() => of(null).pipe(
        tap(() => this.updatePagedItems(this.pageIndex, this.pageSize)),
      )),
      tap(() => this.getLinks()),
      concatMap(() => of(null).pipe(
        tap(() => this.getLinks()),
      ))
    ).subscribe({
      complete: () => console.log('sequencia completa')
    });
  }
  private subscreverComportamentos(): void {
    this.comportamentoService.comportamentos$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lista => {
        this.comportamentos = lista;
      });
  }
  private subscreverAtualizacoes(): void {
    this.linkStateService.refreshLink$
      .pipe(takeUntil(this.destroy$))
      .subscribe(refresh => {
        if (refresh!) {
          this.getLinks();
        }
      });
  }
  onChangeTag(event: PageEvent, value: any) {
    this.pageIndex = event!.pageIndex;
    this.pageSize = event!.pageSize;
    let tagValue = `${value}`;
    this.onItemSelecionado(tagValue);
  }
  onItemSelecionado(itemSelecionado: any): void {
    if ( itemSelecionado.split('_')[1].toString() === 'categoria' ) {
      this.itemModificadoCategoria = itemSelecionado.split('_')[0].toString();
      this.itemModificadoTag = '';
    } else {
      this.itemModificadoCategoria = '';
      this.itemModificadoTag = itemSelecionado.split('_')[0].toString();
    }
    this.resetPaginador();
    this.getLinks();
  }
  getLinks(): void {
    this.homeService.getLinks(this.pageIndex, this.pageSize, this.categoriaExcessao, this.itemModificadoCategoria, this.itemModificadoTag).subscribe({
      next: (response: any) => {
        
        //console.log('response-get-links==> ',response);
        
        let lnk = response.atividades;
          lnk.sort((a: any, b: any) => a.name.localeCompare(b?.name));
          this.links = lnk;
          this.totalLinks = response.total;
      },
      error: (err: string) => {
        console.error(err);
      }
    });
  }
  abrirDialog(obj: IactionStatus, showSite?: boolean): void {
    const dialogRef = this.dialog.open(DialogContentComponent, {
      width: '200vw',
      height: '100vh',
      data: {
        id: obj.id,
        name: obj.name,
        url: obj.url,
        uri: [obj.uri],
        status: 'alterar',
        categoria: obj.categoria,
        descricao: obj.descricao,
        tag: [obj.tag],
        subCategoria: obj.subCategoria,
        oldCategoria: obj.categoria,
        showSite: showSite,
        dataEntradaManha: obj.dataEntradaManha,
        dataSaidaManha: obj.dataSaidaManha,
        dataEntradaTarde: obj.dataEntradaTarde,
        dataSaidaTarde: obj.dataSaidaTarde,
        dataEntradaNoite: obj.dataEntradaNoite,
        dataSaidaNoite: obj.dataSaidaNoite
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getLinks();
        this.linkStateService.triggerRefresh();
      }
    });
  }
  delete(id: number): void {
    this.homeService.deleteLink(id).subscribe({
      next: () => {
        this.mostrarMensagem('Card excluido com sucesso!');
        this.getLinks();
        this.linkStateService.triggerRefresh();
      },
      error: (err: any) => console.error(err)
    });
  }
  mostrarMensagem(msg: string): void {
    this.snackBar.open(msg, 'Fechar', {
      duration: 5000, // em milissegundos
      verticalPosition: 'top',   // ou 'bottom'
      horizontalPosition: 'right' // ou 'left', 'center'
    });
  }
  getTags(tag: any): string[] {
    if( this.hasTags(tag) ) {
      if( Array.isArray(tag?.tags)) {
        return tag.tags;
      }
      if ( Array.isArray(tag)) {
        const allTags: string[] = [];
        tag.forEach((item: any) => {
          if (Array.isArray(item?.tags)) {
            allTags.push(...item.tags);
          }
        });
        return allTags;
      }
    }
    return [];
  }
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
      let x = data.some(item => item.tags && Array.isArray(item.tags) && item.tags.length > 0); 
      return data.some(item => item.tags && Array.isArray(item.tags) && item.tags.length > 0);
    }
    return false;
  }
  resetPaginador(): void {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.totalLinks = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
}