import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-tinymce',
  templateUrl: './tinymce.component.html',
  styleUrls: ['./tinymce.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TinymceComponent),
      multi: true
    }
  ]
})
export class TinymceComponent implements ControlValueAccessor {

  //@Input() public descricao: any;

  value: string = '';

  //** TinyMCE configuration */
  init: EditorComponent['init'] = {
    plugins: [
      'accordion', 'anchor', 'autolink', 'autoresize', 'autosave', 'charmap', 
      'code', 'codesample', 'directionality', 'emoticons', 'fullscreen', 'help',
      'image', 'importcss', 'insertDateTime', 'link', 'lists', 'media', 'listStyles', 
      'media', 'nonbreakingspace', 'pageBreak', 'preview', 'quicktoolbars', 'save', 
      'searchreplace', 'table', 'visualblocks', 'visualCharacters', 'wordcount',
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Alexandre Esteves',
    uploadcare_public_key: 'a08bc755cbb5572c8fac',
    skin: 'oxide-dark',
    selector: 'textarea',
    min_height: 435,
    max_height: 800
  }

   /*
    mergetags_list: [
      { value: 'First.Name', title: 'First Name' },
      { value: 'Email', title: 'Email' },
    ],
    file_picker_callback: (callback, value, meta) => {
    },
    ai_request: (request: any, respondWith: any) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
        // Your account includes a free trial of TinyMCE premium features
        // Try the most popular premium features until Aug 30, 2025:
        'checklist', 'mediaembed', 'casechange', 'formatpainter', 
        'pageembed', 'a11ychecker', 'tinymcespellchecker', 
        'permanentpen', 'powerpaste', 'advtable', 'advcode', 
        'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 
        'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 
        'typography', 'inlinecss', 'markdown','importword', 
        'exportword', 'exportpdf'
    */
  
  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
      this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
      this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
      
  }

  handleEditorChange(content: string): void {
    this.value = content;
    this.onChange(content);
    this.onTouched();
  }

}
