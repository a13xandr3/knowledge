# Análise e Ações — knowledge_new

Data: 2025-10-19 05:17

## Visão Geral
Projeto Angular 15 analisado. Este relatório descreve problemas, ajustes aplicados automaticamente e recomendações.

## Estrutura (amostragem)
```
./
  index.html
  main.spec.ts
  main.ts
  polyfills.spec.ts
  polyfills.ts
  styles.scss
  test.spec.ts
  test.ts
  app/
    app-routing.module.spec.ts
    app-routing.module.ts
    app.component.html
    app.component.scss
    app.component.spec.ts
    app.component.ts
    app.module.spec.ts
    app.module.ts
    app/core/
      app/core/interceptors/
        auth.interceptor.spec.ts
        auth.interceptor.ts
    app/components/
      app/components/home/
        home.component.html
        home.component.scss
        home.component.spec.ts
        home.component.ts
      app/components/footer/
        footer.component.html
        footer.component.scss
        footer.component.spec.ts
        footer.component.ts
      app/components/dialog-content/
        dialog-content.component.html
        dialog-content.component.scss
        dialog-content.component.spec.ts
        dialog-content.component.ts
      app/components/header/
        header.component.html
        header.component.scss
        header.component.spec.ts
        header.component.ts
  environments/
    environment.prod.spec.ts
    environment.prod.ts
    environment.spec.ts
    environment.ts
  shared/
    shared/pipe/
      duration.pipe.spec.ts
      duration.pipe.ts
      hora-formatada.pipe.spec.ts
      hora-formatada.pipe.ts
    shared/response/
      response.spec.ts
      response.ts
    shared/utils/
      common.spec.ts
      common.ts
    shared/models/
      file-ref.model.spec.ts
      file-ref.model.ts
    shared/state/
      link-state-service.spec.ts
      link-state-service.ts
    shared/components/
      shared/components/uploader/
        uploader.component.html
        uploader.component.scss
        uploader.component.spec.ts
        uploader.component.ts
      shared/components/show-file/
        show-file.component.html
        show-file.component.scss
        show-file.component.spec.ts
        show-file.component.ts
      shared/components/mat-chips/
        mat-chips.component.html
        mat-chips.component.scss
        mat-chips.component.spec.ts
        mat-chips.component.ts
      shared/components/quill/
        quill-configuration.spec.ts
        quill-configuration.ts
        quill.component.html
        quill.component.scss
        quill.component.spec.ts
        quill.component.ts
      shared/components/input-file/
        file-selection.util.spec.ts
        file-selection.util.ts
        file-utils.spec.ts
        file-utils.ts
        input-file.component.html
        input-file.component.scss
        input-file.component.spec.ts
        input-file.component.ts
    shared/request/
      request.spec.ts
      request.ts
    shared/services/
      comportamento.service.spec.ts
      comportamento.service.ts
      file-api.service.spec.ts
      file-api.service.ts
      file-preview.bus.service.spec.ts
      file-preview.bus.service.ts
      home.service.spec.ts
      home.service.ts
      link-mapper.service.spec.ts
      link-mapper.service.ts
      login.service.spec.ts
      login.service.ts
      snack.service.spec.ts
      snack.service.ts
      shared/services/file-ref/
        file-ref.module.spec.ts
        file-ref.module.ts
  public/
    public/icos/
    public/fonts/
      public/fonts/Alumni_Sans_Pinstripe/
      public/fonts/Poppins/
      public/fonts/Raleway/
        public/fonts/Raleway/static/
  assets/
    assets/imgs/
    assets/data/
```

## Ações aplicadas automaticamente
1. **Documentação gerada** em `docs/COMPONENTS.md` com Inputs/Outputs/EventEmitters, métodos e ciclos de vida por classe.
2. **Correção de paths de assets em SCSS**: referências profundas como `../../../assets/...` foram reescritas para `url("/assets/…")`.
3. **Lazy-loading de imagens**: adicionamos `loading="lazy"` a tags `<img>` onde não havia.
4. **Configurações de build**:
   - Orçamentos/budgets de bundle adicionados à configuração de produção no `angular.json`.
   - Otimizações da configuração de produção checadas.
5. **Testes unitários base**: arquivos `*.spec.ts` foram gerados para componentes e serviços ausentes (teste de criação + existência de métodos).
6. **Boas práticas de browserslist**: arquivo `browserslist` com alvo moderno para reduzir polyfills em builds de produção.

## Recomendações (não-automáticas)
- **Dividir vendor.js** por meio de _lazy loading_ de features pesadas (editor WYSIWYG, pdf-viewer, charts).
- **Material**: importar módulos granulares; evitar um `MaterialModule` “tudo em um”.
- **Substituir Moment.js** por `date-fns` (ou importar apenas locales estritamente necessários).
- **Lodash**: trocar por `lodash-es` e importações por função.
- **CSS grande**: rever `styles.scss` para retirar frameworks duplicados e fontes não utilizadas; ativar CSS minification e purge (ex.: com Tailwind JIT se aplicável).

Veja `docs/RAW_SIZE_PLAN.md` para detalhes e snippets.
