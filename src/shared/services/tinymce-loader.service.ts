/*
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TinymceLoaderService {
  
  private loadingPromise: Promise<void> | null = null;

  constructor() { }
  
  load(): Promise<void> {

    if ((window as any).tinymce) return Promise.resolve(); // já carregado
    
    if (this.loadingPromise) return this.loadingPromise;
  
    this.loadingPromise = new Promise<void>((resolve, reject) => {

      const id = 'tinymce-script';

      if (document.getElementById(id)) return resolve();
  
      const script = document.createElement('script');
      script.id = id;
      script.src = '/assets/tinymce/tinymce.min.js'; // 👈 self-hosted
      script.referrerPolicy = 'origin';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Falha ao carregar TinyMCE (assets).'));

      document.body.appendChild(script);

    });
  
    return this.loadingPromise;
  }

}
  */