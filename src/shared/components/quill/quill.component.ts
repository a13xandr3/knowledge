import { 
  AfterViewInit, 
  Component, 
  ElementRef, 
  forwardRef, 
  OnDestroy, 
  ViewChild,
  ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Quill from 'quill';

@Component({
  selector: 'app-quill',
  templateUrl: './quill.component.html',
  styleUrls: ['./quill.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuillComponent),
      multi: true
    }
  ]
})
export class QuillComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {

  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef<HTMLDivElement>;

  private quill: Quill | null = null;
  private _value = '';

  // callbacks do Angular Forms
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  private isSettingContents = false; // evita loops

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.quill = new Quill(this.editorContainer.nativeElement, {
      theme: 'snow',
      placeholder: 'Escreva aqui...',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image']
        ]
      }
    });

// se já tivemos um valor vindo do form antes da criação, aplica agora
    if (this._value) {
      this.setEditorHtmlSilent(this._value);
    }

    // escuta alterações do editor e propaga para o FormControl
    this.quill.on('text-change', () => {
      if (this.isSettingContents) return; // prevenir reentrância quando setamos conteúdo programaticamente

      const html = this.quill!.root.innerHTML;
      // trata conteúdo "vazio" do Quill (linha em branco)
      const value = (html === '<p><br></p>') ? '' : html;
      this._value = value;
      this.onChange(this._value);
    });

    // importante para garantir que Angular detecte mudanças depois da criação do editor
    this.cdr.detectChanges();
  }

  // writeValue pode ser chamado antes ou depois da inicialização do editor
  writeValue(value: string | null): void {
    this._value = value ?? '';
    if (this.quill) {
      // se editor já existe, aplica *silenciosamente* para não disparar 'text-change' indesejado
      this.setEditorHtmlSilent(this._value);
    }
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.quill) {
      this.quill.enable(!isDisabled);
    }
  }

  // função utilitária para aplicar HTML ao editor sem disparar text-change
  private setEditorHtmlSilent(html: string) {
    if (!this.quill) return;
    this.isSettingContents = true;
    try {
      if (!html) {
        this.quill.setContents(this.quill.clipboard.convert(''), 'silent');
      } else {
        const delta = this.quill.clipboard.convert(html);
        this.quill.setContents(delta, 'silent');
      }
    } finally {
      // pequeno timeout evita condições de corrida com eventos internos do Quill
      setTimeout(() => {
        this.isSettingContents = false;
      }, 0);
    }
  }

  ngOnDestroy(): void {
    // cleanup
    if (this.quill) {
      try { (this.quill as any).off && (this.quill as any).off(); } catch {}
      this.quill = null;
    }
  }
}