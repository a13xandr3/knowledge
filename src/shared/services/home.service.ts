import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILinkRequest } from 'src/shared/request/request';
import { ILinksResponse } from 'src/shared/response/response';

const token = localStorage.getItem('token');

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
  carregaConteudo(urlTarget: string): Observable<any> {
    return this.http.get(`${this.urlBrowser}?url=${urlTarget}`, { responseType: 'text' });
  }
  getLinks(pageIndex: number, pageSize: number, excessao: any[], categoria: string, tag: string): Observable<{ links: ILinksResponse[]; total: number }> {
    let params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('limit', pageSize.toString())
    .set('categoria', categoria)
    .set('tag', tag);
    excessao.forEach((item: any) => {
      params = params.append('excessao', item);
    });
    return this.http.get<{ links: ILinksResponse[]; total: number }>(this.url, { params, 
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}` 
      })
     } );
  }
  //** Monta lista de Dropdown */
  getCategorias(): Observable<ILinksResponse> {
    return this.http.get<ILinksResponse>(`${this.urlCategorias}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}` 
      })
    });
  }
  getTags(): Observable<ILinksResponse> {
    return this.http.get<ILinksResponse>(`${this.urlTags}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}` 
      })
    });
  }
  //** ao selecionar o item no dropdown */
  getSearchCategoria(pageIndex: number, pageSize: number, itemCategoria: string): Observable<{ links: ILinksResponse[]; total: number }> {
    let params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('limit', pageSize.toString())
      .set('categoria', itemCategoria);
    return this.http.get<{ links: ILinksResponse[]; total: number }>(`${this.urlSearchCategoria}`, { params,
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}` 
      })
     });
  }
  getLink(id: number): Observable<ILinksResponse> {
    return this.http.get<ILinkRequest>(`${this.url}/id`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}` 
      })
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
    return this.http.post<ILinksResponse>(`${this.url}`, auxRequest, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}` 
      })
    });
  }
  putLink(request: ILinkRequest): Observable<ILinksResponse> {
    const token = localStorage.getItem('token');
    return this.http.put<ILinksResponse>(`${this.url}/${request.id}`, request, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }
  deleteLink(id: number): Observable<ILinksResponse> {
    return this.http.delete<ILinksResponse>(`${this.url}/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}` 
      })
    });
  }
}