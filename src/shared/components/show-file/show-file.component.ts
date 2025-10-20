import { Component, Inject, OnDestroy, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  restoreFilesFromSnapshot,
  downloadFile,
  ProcessedSnapshot
} from '../input-file/file-utils';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
type RenderKind = 'image' | 'text' | 'pdf' | 'docx' | 'xlsx' | 'other';
interface ShowFileData {
  snapshot?: ProcessedSnapshot;
  itemId?: string | number; // opcional: exibir no header
}
@Component({
  selector: 'app-show-file',
  templateUrl: './show-file.component.html',
  styleUrls: ['./show-file.component.scss'],
})
export class ShowFileComponent implements OnInit, OnDestroy {
  @ViewChild('docxHost', { static: false }) docxHost?: ElementRef<HTMLDivElement>;
  xlsxHtml: SafeHtml | null = null;
  docxHtml: SafeHtml | null = null;
  loading = true;
  originalFile!: File;
  objectUrl = '';
  safeObjectUrl: SafeResourceUrl | null = null;
  previewText = '';
  renderKind: RenderKind = 'other';
  itemId: string | number | undefined;
  get prettySize(): string {
    if (!this.originalFile) return '';
    const b = this.originalFile.size;
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} kB`;
    return `${(b / (1024 * 1024)).toFixed(2)} MB`;
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ShowFileData | null,
    public dialogRef: MatDialogRef<ShowFileComponent>,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}
  async ngOnInit() {
    this.loading = true;
    try {
      this.itemId = this.data?.itemId;
      // 100% via data do diálogo
      const snap = this.data?.snapshot;
      if (!snap) {
        console.warn('[ShowFile] Snapshot não informado no MAT_DIALOG_DATA.');
        this.renderKind = 'other';
        return;
      }
      // Restaura arquivo original
      const { originalFile } = await restoreFilesFromSnapshot(snap, true);
      this.originalFile = originalFile;
      // Decide renderização
      const mt = (originalFile.type || '').toLowerCase();
      if (mt.startsWith('image/')) {
        this.renderKind = 'image';
        this.objectUrl = URL.createObjectURL(originalFile);
      } else if (mt.startsWith('text/') || mt.endsWith('.csv') || mt.endsWith('.json')) {
        this.renderKind = 'text';
        const ab = await originalFile.arrayBuffer();
        this.previewText = new TextDecoder('utf-8').decode(ab).slice(0, 50_000);
      } else if (mt === 'application/pdf' || originalFile.name.toLowerCase().endsWith('.pdf')) {
        this.renderKind = 'pdf';
        this.objectUrl = URL.createObjectURL(originalFile);
        this.safeObjectUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
      } else if (mt === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || originalFile.name.toLowerCase().endsWith('.xlsx')) {
        const ab = await originalFile.arrayBuffer();
        await this.renderXlsx(ab);        // <<-- novo
        this.renderKind = 'xlsx';
      } else if (
        mt === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        originalFile.name.toLowerCase().endsWith('.docx')
      ) {
        this.renderKind = 'docx';
        this.loading = false; 
        const ab = await originalFile.arrayBuffer();
        // garante que o host #docxHost já existe no DOM
        await this.nextTick();
        await this.ensureDocxHostReady();
        try {
          await this.renderDocxIntoHost(ab);       // docx-preview (melhor fidelidade)
        } catch (e) {
          console.warn('[ShowFile] docx-preview falhou, fallback mammoth:', e);
          await this.renderDocxWithMammoth(ab);    // fallback para HTML
        }
      } else {
        this.renderKind = 'other';
      }
    } catch (e) {
      console.error('[ShowFile] erro ao inicializar preview:', e);
      this.renderKind = 'other';
    } finally {
    }
    return;
  }
  private async nextTick(): Promise<void> {
    this.cdr.detectChanges();
    await new Promise(r => setTimeout(r, 0));
  }
  download() {
    if (this.originalFile) {
      downloadFile(this.originalFile);
    }
  }
  close() {
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  }
  /** Renderiza XLSX em HTML usando SheetJS */
  private async renderXlsx(ab: ArrayBuffer): Promise<void> {
    const XLSX = await import('xlsx'); // dynamic import para reduzir vendor
    const wb = XLSX.read(ab, { type: 'array' });
    const first = wb.SheetNames[0];
    const sheet = wb.Sheets[first];
    // Gera HTML da planilha
    const html: string = XLSX.utils.sheet_to_html(sheet, {
      header: '',
      footer: '',
    });
    // Sanitiza para binding seguro
    this.xlsxHtml = this.sanitizer.bypassSecurityTrustHtml(html);
  }
  /** Renderiza DOCX em HTML; escolha UMA das abordagens abaixo */
  // (A) Melhor fidelidade: docx-preview
  private async renderDocx(ab: ArrayBuffer): Promise<void> {
    const { default: Docx } = await import('docx-preview'); // tipagem default
    // docx-preview normalmente injeta em um container; aqui convertemos para string
    // via renderToHtml. Se sua versão não expõe utilitário HTML, use mammoth (abaixo).
    // @ts-ignore (algumas versões expõem renderAsync para container; alternativa B abaixo)
    const html = await (Docx as any).renderToHtml?.(ab) ?? '';
    if (html) {
      this.docxHtml = this.sanitizer.bypassSecurityTrustHtml(html);
      return;
    }
    // fallback para (B) mammoth se a API acima não existir:
    await this.renderDocxWithMammoth(ab);
  }
  /** Aguarda um tick para o Angular materializar o #docxHost no DOM */
  private async ensureDocxHostReady(): Promise<void> {
    // força um ciclo de change detection
    this.cdr.detectChanges?.();
    // aguarda microtask: garante que o template do ngSwitchCase foi aplicado
    await Promise.resolve();
    // opcional: um pequeno timeout em edge-cases
    if (!this.docxHost?.nativeElement) {
      await new Promise(r => setTimeout(r, 0));
    }
    if (!this.docxHost?.nativeElement) {
      throw new Error('docxHost não disponível no template.');
    }
  }
  /** Renderiza DOCX diretamente no container via docx-preview */
  private async renderDocxIntoHost(ab: ArrayBuffer): Promise<void> {
    const docx = (await import('docx-preview')).default;
    const host = this.docxHost!.nativeElement;
    host.innerHTML = ''; // limpa render anterior, se houver
    await docx.renderAsync(ab, host, {
      className: 'docx',
      useBase64URL: true,  // evita links blob externos
      ignoreWidth: false,
      ignoreHeight: false,
      breakPages: false,
      // experimental: true, // se quiser habilitar recursos experimentais
    });
  }
  /** Fallback: converte DOCX -> HTML com mammoth (menor fidelidade, mais leve) */
  private async renderDocxWithMammoth(ab: ArrayBuffer): Promise<void> {
    const mammoth: any = await import('mammoth/mammoth.browser');
    const result = await mammoth.convertToHtml({ arrayBuffer: ab }, {
      styleMap: [
        "p[style-name='Title'] => h1:fresh",
        "p[style-name='Subtitle'] => h2:fresh"
      ]
    });
    this.docxHtml = this.sanitizer.bypassSecurityTrustHtml(result.value);
  }
}
