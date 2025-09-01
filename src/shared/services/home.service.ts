import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILinkRequest } from 'src/shared/request/request';
import { ILinksResponse } from 'src/shared/response/response';
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private url = 'http://localhost:8081/api/atividade';
  private urlCategorias = 'http://localhost:8081/api/atividade/categorias';
  private urlTags = 'http://localhost:8081/api/atividade/tags';
  private urlSearchCategoria = 'http://localhost:8081/api/atividade';
  private urlBrowser = 'http://localhost:8081/proxy';
  constructor(
    private http: HttpClient,
  ) { }
  /*
  _carregarConteudo(urlTarget: string): any {
    let retorno;
    this.http.get(`${this.urlBrowser}?url=${urlTarget}`, { responseType: 'text' })
      .subscribe({
        next: data => retorno = data,
        error: err => console.error(err)
    });
    return retorno;
  }
  */
  carregaConteudo(urlTarget: string): Observable<any> {
    return this.http.get(`${this.urlBrowser}?url=${urlTarget}`, { responseType: 'text' });
  }
  /*
  getThumbs(): Observable<any> {
    // let image = '';
    let image = ''
    let params = new HttpParams().set('url', image);
    return this.http.post<any>('http://localhost:8081/api/fxpreview', {}, { params });
  }
  */
  getLinks(pageIndex: number, pageSize: number, excessao: any[], categoria: string, tag: string): Observable<{ links: ILinksResponse[]; total: number }> {
    let params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('limit', pageSize.toString())
    .set('categoria', categoria)
    .set('tag', tag);
    excessao.forEach((item: any) => {
      params = params.append('excessao', item);
    });
    return this.http.get<{ links: ILinksResponse[]; total: number }>(this.url, { params });
  }
  //** Monta lista de Dropdown */
  getCategorias(): Observable<ILinksResponse> {
    return this.http.get<ILinksResponse>(`${this.urlCategorias}`);
  }
  getTags(): Observable<ILinksResponse> {
    return this.http.get<ILinksResponse>(`${this.urlTags}`);
  }
  //** ao selecionar o item no dropdown */
  getSearchCategoria(pageIndex: number, pageSize: number, itemCategoria: string): Observable<{ links: ILinksResponse[]; total: number }> {
    let params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('limit', pageSize.toString())
      .set('categoria', itemCategoria);
    return this.http.get<{ links: ILinksResponse[]; total: number }>(`${this.urlSearchCategoria}`, { params });
  }
  getLink(id: number): Observable<ILinksResponse> {
    return this.http.get<ILinkRequest>(`${this.url}/id`);
  }
  postLink_(request: ILinkRequest): Observable<void> {
    const auxRequest = {
      name: request.name,
      url: request.url,
      uri: request.uri,
      categoria: request.categoria,
      subCategoria: request.subCategoria,
      descricao: request.descricao,
      dataEntradaManha: request.dataEntradaManha,
      dataSaidaManha: request.dataSaidaManha,
      dataEntradaTarde: request.dataEntradaTarde,
      dataSaidaTarde: request.dataSaidaTarde,
      dataEntradaNoite: request.dataEntradaNoite,
      dataSaidaNoite: request.dataSaidaNoite
    }
    return this.http.post<void>(`${this.url}`, auxRequest, {
      headers: { 'Content-Type': 'application/json' }
    });
  }  
  postLink(request: ILinkRequest): Observable<ILinksResponse> {
    const auxRequest = {
      name: request.name,
      url: request.url,
      uri: request.uri,
      categoria: request.categoria,
      subCategoria: request.subCategoria,
      descricao: request.descricao,
      tag: request.tag,
      dataEntradaManha: request.dataEntradaManha,
      dataSaidaManha: request.dataSaidaManha,
      dataEntradaTarde: request.dataEntradaTarde,
      dataSaidaTarde: request.dataSaidaTarde,
      dataEntradaNoite: request.dataEntradaNoite,
      dataSaidaNoite: request.dataSaidaNoite
    }
    return this.http.post<ILinksResponse>(`${this.url}`, auxRequest);
  }
  putLink(request: ILinkRequest): Observable<ILinksResponse> {
    return this.http.put<ILinksResponse>(`${this.url}/${request.id}`, request );
  }
  deleteLink(id: number): Observable<ILinksResponse> {
    return this.http.delete<ILinksResponse>(`${this.url}/${id}`);
  }
}