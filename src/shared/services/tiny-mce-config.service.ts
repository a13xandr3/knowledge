/*
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TinyMceConfigService {

  private readonly baseConfig = {
    base_url: '/assets/tinymce',
    skin_url: '/assets/tinymce/skins/ui/oxide',
    content_css: '/assets/tinymce/skins/content/default/content.css',
    promotion: false,
    menubar: 'file edit view insert format tools table help',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
    height: 400
  };

  getConfig(customConfig: any = {}) {
    return { ...this.baseConfig, ...customConfig };
  }

}
  */
