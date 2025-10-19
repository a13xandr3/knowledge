import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { restoreFilesFromSnapshot, downloadFile, ProcessedSnapshot } from '../input-file/file-utils';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

type RenderKind = 'image' | 'text' | 'pdf' | 'other';

@Component({
  selector: 'app-show-file',
  templateUrl: './show-file.component.html'
})
export class ShowFileComponent implements OnInit, OnDestroy {
  loading = true;
  originalFile!: File;
  objectUrl: string = '';
  previewText = '';
  renderKind: RenderKind = 'other';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { snapshot?: ProcessedSnapshot } | null,
    public dialogRef: MatDialogRef<ShowFileComponent>
  ) {}

  async ngOnInit() {
    try {
      let snap: ProcessedSnapshot | null = null;
      if (this.data && this.data.snapshot) {
        snap = this.data.snapshot;
      } else {
        const raw = sessionStorage.getItem('lastSnapshot');
        if (raw) snap = JSON.parse(raw) as ProcessedSnapshot;
      }
      if (!snap) throw new Error('Nenhum snapshot encontrado.');
      const { originalFile } = await restoreFilesFromSnapshot(snap, true);
      this.originalFile = originalFile;
      // Decide como renderizar
      const mt = (originalFile.type || '').toLowerCase();
      if (mt.startsWith('image/')) {
        this.renderKind = 'image';
        this.objectUrl = URL.createObjectURL(originalFile);
      } else if (mt.startsWith('text/') || mt.includes('csv') || mt.includes('json')) {
        this.renderKind = 'text';
        const ab = await originalFile.arrayBuffer();
        this.previewText = new TextDecoder('utf-8').decode(ab).slice(0, 50000); // preview
      } else if (mt === 'application/pdf') {
        this.renderKind = 'pdf';
        this.objectUrl = URL.createObjectURL(originalFile);
      } else {
        this.renderKind = 'other';
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }
  download() {
    if (this.originalFile) downloadFile(this.originalFile);
  }
  ngOnDestroy(): void {
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
  }
}
