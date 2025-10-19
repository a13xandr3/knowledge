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
  
import { FileSavedResponse, ILinkRequest, ProcessedFile } from '../../../shared/request/request';
import { LinkMapperService } from './../../../shared/services/link-mapper.service';
import { SnackService } from './../../../shared/services/snack.service';
import { LinkStateService } from '../../../shared/state/link-state-service';
import { HomeService } from '../../../shared/services/home.service';
import { FileApiService } from '../../../shared/services/file-api.service';

import { FilesPayload, FileRef as FileRefCore, extractIds, idToFilename, diffRemovedIds, mergeExistingAndNew } from '../../../shared/components/input-file/file-selection.util';
import { concatMap, map, catchError } from 'rxjs/operators';
import { of, forkJoin, throwError, Observable, Subscription } from 'rxjs';

export interface FileRef {
  id: number;
  filename: string;
}
type FileRef_ = { id: number; filename: string };
type FilesPayload_ = { fileRefs: FileRef[] };

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss'],
  providers: [DatePipe]
})
export class DialogContentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  @ViewChild('uriInput') uriInput!: ElementRef<HTMLInputElement>;
  tempoRestanteMs: number = 0;
  separatorKeysCodes: number[] = [ENTER, COMMA];  //chip
  allTags: string[] = [];                         //Tags
  allUris: string[] = [];                         //Uri
  allFiles: FilesPayload = { files: [] };
  fr: FormGroup;
  exibeSite: any;
  safeUrl: SafeResourceUrl | undefined;
  currentContent = '';
  totalHorasDia!: string;
  allowMultiple = true;
  //public previewsFromIds: Array<{ url: string; filename: string; mimeType?: string; sizeBytes: number, fileId?: number }> = [];
  public previewsFromIds: Array<{ id?: number; url: string; filename: string; mimeType?: string; sizeBytes: number }> = [];
  /** Fila de arquivos processados pelo input-file (payloadBytes etc.) */
  private initialIds: number[] = [];  
  private fileQueue: ProcessedFile[] = [];
  private sub?: Subscription;

  constructor(
    private service: HomeService,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogContentComponent>,
    private linkStateService: LinkStateService,
    private linkMapperService: LinkMapperService,
    private snackService: SnackService,
    private filesApiService: FileApiService  ) 
  {
    this.iniciarContagem(86400000); // 24 horas
    if ( this.data?.categoria.toLowerCase() == 'timesheet' ) {
      this.totalHorasDia = data?.totalHorasDia;
    }
    this.fr = this.fb.group({
      id: [{ value: data?.id || '', disabled: true }],
      name: [data?.name],
      uri: [this.linkMapperService.normalizeUris(data)],
      tag: [this.linkMapperService.normalizeTags(data)],
      fileID: [Array.isArray(this.data?.fileID) ? this.data.fileID : []],
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
    // this.removeArray(this.data.fileID, 5);
  }
  /*
  removeArray(
      data: { fileRefs: Array<{ id: unknown; filename: unknown }> },
      removeId: number
    ): FilesPayload_ {
      let parsed: any;
      try {
        parsed = typeof data === 'string' ? JSON.parse(data) : data;
      } catch (e: any) {
        console.error('JSON inválido', e);
        return { fileRefs: [] };
      }
      const normalized: FileRef[] = Array.isArray(parsed[0]?.fileRefs)
        ? parsed[0]?.fileRefs?.map((fr: any) => ({
              id: Number(fr?.id),
              filename: String(fr?.filename ?? '')
            })).filter((fr: any) => Number.isFinite(fr.id) && !!fr.filename.trim())
        : [];
        const result: FilesPayload_ = {
          fileRefs: normalized?.filter((fr: any) => fr.id !== Number(removeId))
        };
      console.log('Após remoção:', result.fileRefs);
      return result;
  }
  */
  /*
  ngOnInit(): void {
    const ids = (this.data?.fileID?.[0]?.fileRefs ?? [])
        .map((x: any) => {
          if (typeof x === 'number') return x;
          if (typeof x === 'string') {
            const s = x.trim();
            if (/^\d+$/.test(s)) return Number(s);                  // "10" → 10
            const m = s.match(/^(\d+)\.[a-z0-9]+$/i);               // "10.jpg" → 10
            return m ? Number(m[1]) : NaN;
          }
          if (x && typeof x === 'object') {
            const v = x.id ?? x.fileId ?? x.file_id ?? x.fileID;    // também suporta objetos comuns
            if (typeof v === 'number') return v;
            if (typeof v === 'string') {
              const t = v.trim();
              if (/^\d+$/.test(t)) return Number(t);
              const m = t.match(/^(\d+)\.[a-z0-9]+$/i);
              return m ? Number(m[1]) : NaN;
            }
          }
          return NaN;
        })
        .filter(Number.isFinite);
    if (ids.length) {
      this.filesApiService.buildPreviewsFromFileIds(ids).then(items => {
        this.previewsFromIds = items;
        // derive os IDs que realmente foram exibidos (em ordem)
        this.initialIds = items
          .map(it => it.id)
          .filter((n): n is number => Number.isFinite(n));
      // o form também deve refletir a ordem/seleção exibida:
        this.fr.get('fileID')?.setValue(this.initialIds);
      });
    }
  }
  */
  ngOnInit(): void {
    const ids = (this.data?.fileID?.[0]?.fileRefs ?? [])
      .map((x: any) => Number(
        typeof x === 'object' ? (x.id ?? x.fileId ?? x.file_id ?? x.fileID) : x
      ))
      .filter(Number.isFinite);
    if (ids.length) {
      this.initialIds = [...ids]; // snapshot de origem
      this.filesApiService.buildPreviewsFromFileIds(ids).then(items => {
        this.previewsFromIds = items;               // items agora possuem { id, url, filename... }
        this.fr.get('fileID')?.setValue(ids);       // form reflete o que foi carregado
      });
    }
  }
  ngAfterViewInit(): void {
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
  fechar() {
    this.dialogRef.close();
  }
  deleteFiles(currentIds: number[]): Observable<unknown> {
    const delete$: Observable<unknown> = currentIds.length
      ? forkJoin(currentIds.map(id => this.filesApiService.delete(id)))
      : of(null);
    return delete$;
  }
  uploadOne(): Observable<FileRef[]> {
    const upload$: Observable<FileRef[]> = this.fileQueue.length
      ? forkJoin(this.fileQueue.map(p => this.filesApiService.uploadOne(p))).pipe(
          map((resps: FileSavedResponse[]) =>
            resps.map((r, i) => ({
              id: r.id,
              filename: this.fileQueue[i]?.filename ?? `file-${r.id}`
            }))
          )
        )
      : of<FileRef[]>([]);
    return upload$;
  }
  onChipClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const url = target?.innerText.trim();
    if ( url && this.isValidHttpUrl(url) && !url.endsWith('X') ) {
      const tempAnchor = document.createElement('a');
      tempAnchor.href = url;
      tempAnchor.target = '_blank';
      tempAnchor.click();
    }
  }
  private isValidHttpUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  }
  iniciarContagem(ms: number): void {
    this.sub?.unsubscribe();
    this.sub = this.linkMapperService.countdown(ms).subscribe({
      next: remainingMs => this.tempoRestanteMs = remainingMs,
      complete: () => console.log('Contagem finalizada!')
    });
  }
  onProcessed(p: ProcessedFile) {
    // Empilha para upload posterior (na hora do salvar)
    this.fileQueue.push(p);
    // Opcional: mostrar nomes adicionados na UI
    // adiciona um objeto FileRef ao array files
    this.allFiles.files.push({ id: -1, filename: p.filename });
  }
  onClearedFiles() {
    this.fileQueue = [];
    this.allFiles = { files: [] };
  }
  onError(err: unknown) {
    console.error(err);
  }
  private gatherExistingFileRefs(): FileRef[] {
    console.log('gatherExistingFileRefs');
    const ids: number[] = (this.fr.get('fileID')?.value ?? []).filter(Number.isFinite);
    // Tenta reaproveitar o filename vindo dos previews; se não houver, usa um fallback estável
    return ids.map((id, i) => ({
      id,
      filename: this.previewsFromIds[i]?.filename ?? `file-${id}`
    }));
  }
  // chamado pelo (removedAt)
  // o filho emite o índice removido; aqui removemos o id correspondente do form
  onPreviewRemoved(idx: number) {
    const removedId = this.previewsFromIds[idx]?.id;
    if (!Number.isFinite(removedId)) return;
    const id = Number(removedId);
    const ctrl = this.fr.get('fileID');
    const curr: number[] = (ctrl?.value ?? []).filter((v: any) => v !== id);
    ctrl?.setValue(curr);
    // atualiza o snapshot local também
    this.initialIds = this.initialIds.filter(v => v !== id);
  }
  // helper(s) pequenos para delete/upload
  private deleteMany(ids: number[]): Observable<any> {
    return ids.length ? forkJoin(ids.map(id => this.filesApiService.delete(id))) : of(null);
  } 
  private uploadQueue() {
    return this.fileQueue.length
      ? forkJoin(this.fileQueue.map(p => this.filesApiService.uploadOne(p))).pipe(
          map(resps => resps.map((r, i) => ({ id: r.id, filename: this.fileQueue[i]?.filename ?? `file-${r.id}` } as FileRefCore)))
        )
      : of<FileRefCore[]>([]);
  }
  salvar(): void {
    if (this.fr.invalid) return;

    const dados = this.fr.getRawValue();
    const isInclusao = this.data.status === 'inclusao';
    
    this.allTags = dados.tag || [];
    this.allUris = dados.uri || [];
    
    // 1) IDs atuais a partir dos previews compartilhadosf
    const currentIds = extractIds(this.previewsFromIds);
    
    // 2) Para UPDATE: calcule exatamente o que foi removido
    const toDelete = isInclusao ? [] : diffRemovedIds(this.initialIds, currentIds);
    
    // 3) Execução: delete -> upload -> montar payload -> POST/PUT
    this.deleteMany(toDelete).pipe(

      concatMap(() => this.uploadQueue()),
      
      map((newRefs) => {
        
        const nameMap = idToFilename(this.previewsFromIds);
        console.log('nameMap: ->', nameMap);

        const filesPayload = mergeExistingAndNew(currentIds, nameMap, newRefs);
        console.log('filesPayLoad: -> ', filesPayload);

        return this.linkMapperService.buildRequest(
          dados,
          this.allTags,
          this.allUris,
          filesPayload
        );
        
      }),
      concatMap((req: ILinkRequest) => {
        return isInclusao ? this.service.postLink(req) : this.service.putLink(req);
      }),
      catchError(err => {
        this.snackService.mostrarMensagem(err?.message ?? 'Falha ao salvar', 'Fechar');
        return throwError(() => err);
      })
    ).subscribe({
      next: () => {
        this.snackService.mostrarMensagem(
          isInclusao ? 'Card Inserido com sucesso!' : 'Card Atualizado com sucesso!', 'Fechar'
        );
        this.linkStateService.triggerRefresh();
        this.dialogRef.close(dados);
        this.fileQueue = [];
        this.initialIds = extractIds(this.previewsFromIds);
      },
      error: () => {}
    });
  }
}