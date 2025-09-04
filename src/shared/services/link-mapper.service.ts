import { Injectable } from '@angular/core';
import { ILinkRequest } from 'src/shared/request/request';

@Injectable({
  providedIn: 'root'
})
export class LinkMapperService {

  constructor() { }

  normalizeTags(data: any): string[] {
    return Array.isArray(data?.tag?.[0]?.tags)
      ? data.tag[0].tags.map((t: any) =>
          typeof t === 'string' ? t : (t.value ?? t.tag ?? String(t)))
      : [];
  }
  normalizeUris(data: any): string[] {
    return Array.isArray(data?.uri?.[0]?.uris)
      ? data.uri[0].uris.map((u: any) =>
          typeof u === 'string' ? u : (u.value ?? u.uri ?? String(u)))
      : [];
  }
  toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  toDateBr(dt: string | null): string | null {
    if (!dt) return null;
    let data = new Date(dt);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(data);
  }
  ISODate(dt: string | null): string | null {
    if (!dt) return null;
    const [datePart, timePart] = dt.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${(second || '00').padStart(2, '0')}`;
  }
  buildRequest(request: any, tags: string[], uris: string[]): any {
    const isTimesheet = request.categoria?.toLowerCase() === 'timesheet';
    const toISO = (dt: any) => isTimesheet ? this.ISODate(dt) : null;
    return {
      id: request.id,
      name: request.name,
      url: request.url,
      uri: { uris },
      categoria: request.categoria ? this.toTitleCase(request.categoria) : '',
      subCategoria: request.subCategoria ? this.toTitleCase(request.subCategoria) : '',
      descricao: request.descricao,
      tag: { tags },
      dataEntradaManha: toISO(request?.dataEntradaManha),
      dataSaidaManha: toISO(request?.dataSaidaManha),
      dataEntradaTarde: toISO(request?.dataEntradaTarde),
      dataSaidaTarde: toISO(request?.dataSaidaTarde),
      dataEntradaNoite: toISO(request?.dataEntradaNoite),
      dataSaidaNoite: toISO(request?.dataSaidaNoite)
    };
  }

}
