import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import Quill from 'quill';

// --- registrar FontAttributor (classes ql-font-*)
const FontAttributor = Quill.import('attributors/class/font');
FontAttributor.whitelist = ['Alumni', 'Poppins', 'Raleway']; // ⟵ sua whitelist
Quill.register(FontAttributor, true);

// --- registrar SizeAttributor (style size - exemplo: '72px')
const SizeStyle = Quill.import('attributors/style/size');
SizeStyle.whitelist = [
  '8px','10px','12px','14px','16px','18px','20px','36px','72px'
];
Quill.register(SizeStyle, true);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
