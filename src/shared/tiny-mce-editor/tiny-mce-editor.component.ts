/*
import { 
  Component, 
  ElementRef, 
  AfterViewInit, 
  Input, 
  Output, 
  EventEmitter, 
  OnDestroy, 
  NgZone } from '@angular/core';
import { Editor } from 'tinymce';

// Importação do TinyMCE
import tinymce from 'tinymce';

// Importações dos plugins necessários
//import 'tinymce/plugins/advlist';
//import 'tinymce/plugins/autolink';
//import 'tinymce/plugins/lists';
//import 'tinymce/plugins/link';
//import 'tinymce/plugins/image';
//import 'tinymce/plugins/charmap';
//import 'plain-text-link/plain-text-link';
//import 'tinymce/plugins/preview';
//import 'tinymce/plugins/anchor';
//import 'tinymce/plugins/searchreplace';
//import 'tinymce/plugins/visualblocks';
//import 'tinymce/plugins/code';
//import 'tinymce/plugins/fullscreen';
//import 'tinymce/plugins/insertdatetime';
//import 'tinymce/plugins/media';
//import 'tinymce/plugins/table';
//import 'tinymce/plugins/wordcount';
//import 'tinymce/plugins/help';

// Importação dos temas
import 'tinymce/themes/silver';

// Importação dos ícones
import 'tinymce/icons/default';

@Component({
  selector: 'app-tiny-mce-editor',
  templateUrl: './tiny-mce-editor.component.html',
  styleUrls: ['./tiny-mce-editor.component.scss']
})
export class TinyMceEditorComponent implements AfterViewInit, OnDestroy {
  @Input() initialValue: string = '';
  @Output() contentChange = new EventEmitter<string>();
  
  private editor: Editor | null = null;
  private isInitialized = false;
  private textareaElement!: HTMLElement;

  constructor(private elementRef: ElementRef, private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.initializeEditor();
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.remove();
      this.editor = null;
    }
    
    // Remover o textarea do DOM
    if (this.textareaElement && this.textareaElement.parentNode) {
      this.textareaElement.parentNode.removeChild(this.textareaElement);
    }
  }

  private async initializeEditor() {
    // Criar o elemento textarea dinamicamente
    this.textareaElement = document.createElement('textarea');
    this.textareaElement.style.display = 'none'; // Esconder até a inicialização
    this.elementRef.nativeElement.querySelector('.editor-container').appendChild(this.textareaElement);

    // Inicializar o editor
    this.ngZone.runOutsideAngular(() => {
      tinymce.init({
        target: this.textareaElement, // Agora passamos o elemento diretamente
        base_url: '/assets/tinymce',
        skin_url: '/assets/tinymce/skins/ui/oxide',
        content_css: '/assets/tinymce/skins/content/default/content.css',
        promotion: false,
        menubar: 'file edit view insert format tools table help',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'wordcount', 'help'
        ],
        toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
        height: 400,
        setup: (editor: Editor) => {
          this.editor = editor;
          
          editor.on('init', () => {
            this.isInitialized = true;
            if (this.initialValue) {
              editor.setContent(this.initialValue);
            }
          });

          editor.on('change keyup', () => {
            this.ngZone.run(() => {
              this.contentChange.emit(editor.getContent());
            });
          });
        }
      }).then((editors: Editor[]) => {
        if (editors && editors.length > 0) {
          this.editor = editors[0];
        }
      }).catch(error => {
        console.error('Falha ao inicializar o TinyMCE:', error);
      });
    });
  }

  public getContent(): string {
    return this.editor ? this.editor.getContent() : '';
  }

  public setContent(content: string): void {
    if (this.editor && this.isInitialized) {
      this.editor.setContent(content);
    }
  }
  
}
  */
