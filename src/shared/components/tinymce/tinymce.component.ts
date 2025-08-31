import { Component, forwardRef } from '@angular/core';
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
  value: string = '';

  //** configuration Editor */
  init: EditorComponent['init'] = {
    plugins: [
      'accordion', 
      'advlist', 
      'anchor', 
      'autolink', 
      'autoresize', 
      'autosave',
      'charmap', 
      'code', 
      'codesample', 
      'directionality', 
      'emoticons', 
      'fullscreen', 
      'help',
      'image', 
      'importcss', 
      'insertdatetime', 
      'link', 
      'lists', 
      'media', 
      'nonbreaking',
      'pagebreak', 
      'preview', 
      'quickbars', 
      'save', 
      'searchreplace', 
      'table', 
      'visualblocks', 
      'visualchars', 
      'wordcount'
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Alexandre Esteves',
    uploadcare_public_key: 'a08bc755cbb5572c8fac',
    skin: 'oxide-dark',
    selector: 'textarea',
    codesample_global_prismjs: true,
    codesample_languages: [
      { text: 'HTML/XML', value: 'markup' },
      { text: 'JavaScript', value: 'javascript' },
      { text: 'CSS', value: 'css' },
      { text: 'PHP', value: 'php' },
      { text: 'Ruby', value: 'ruby' },
      { text: 'Python', value: 'python' },
      { text: 'Java', value: 'java' },
      { text: 'C', value: 'c' },
      { text: 'C#', value: 'csharp' },
      { text: 'C++', value: 'cpp' }
    ],
    min_height: 435,
    max_height: 800
  }
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
  setDisabledState?(isDisabled: boolean): void {}
  handleEditorChange(content: string): void {
    this.value = content;
    this.onChange(content);
    this.onTouched();
  }
  handleEvent(content: any): void {
    console.log('handleEvent ==> ', content);
  }
}
