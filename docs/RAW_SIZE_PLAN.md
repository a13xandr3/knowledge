
# Plano de Redução de Bundle (Raw Size)

## Situação Atual (reportado)
- **vendor.js**: 5.38 MB — principal alvo de redução
- **styles**: 1.01 MB
- **scripts.js**: 289.91 kB
- **polyfills.js**: 272.22 kB
- **main.js**: 249.50 kB
- **runtime.js**: 8.00 kB

## Táticas por arquivo

### vendor.js (meta: -50% ~ -70%)
1. **WYSIWYG / PDF / Charts via Lazy Route**  
   - Carregar `ngx-quill`, `tinymce`, `pdfjs`, `chart.js` somente nos módulos/rotas que usam:
   ```ts
   const routes = [
     { path: 'editor', loadComponent: () => import('./features/editor/editor.component').then(m => m.EditorComponent) }
   ];
   ```
2. **Angular Material**  
   - Importar apenas módulos necessários; evitar módulos agregadores.
   - Para ícones, usar subset de SVGs em vez do pacote completo.
3. **Datas e utilitários**  
   - `moment` → `date-fns` (ou `luxon`).
   - `lodash` → `lodash-es` com import por função: `import debounce from 'lodash-es/debounce';`

### styles (meta: -40% ~ -60%)
- Evitar importar Bootstrap + Tailwind simultaneamente.
- Remover fontes não utilizadas e variações pesadas; preferir `display=swap`.
- Habilitar minificação em produção (já padrão) e **purga** de utilitários se usar Tailwind.

### scripts.js
- Verificar `angular.json > architect > build > options > scripts` e remover libs globais não utilizadas.

### polyfills.js
- Atualizar `browserslist` para alvos modernos; avaliar retirar polyfills específicos não utilizados.

## Orçamentos sugeridos (angular.json)
- `initial` 1.7MB (warning), 2.0MB (error)
- `anyComponentStyle` 200kB (warning), 400kB (error)

## Métricas pós-ação
- Executar `ng build --configuration production --stats-json` e analisar `dist/**/stats.json` com `webpack-bundle-analyzer`.
