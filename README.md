# Sistema de Registro de Atividades

Este projeto é um sistema Web baseado em Angular 15 que permite registrar e gerenciar atividades com categoria, sub‑categoria, tags, links (URIs), timesheet e anexos. O objetivo da refatoração foi limpar o código, aplicar princípios de Clean Code e SOLID, documentar todas as partes da aplicação e tornar a experiência de desenvolvimento mais clara.

## Visão Geral

O sistema inclui:

- **Upload e visualização de arquivos**: O componente `InputFileComponent` lida com seleção de arquivos via “drag & drop”, compressão com gzip, cálculo de hash SHA‑256 e geração de thumbnails para imagens. Para anexos não‑imagem é exibida uma miniatura genérica usando ícones do Font Awesome (como *file‑pdf*, *file‑word* etc.)【416792451111308†L790-L811】.
- **Persistência de anexos**: O `FileApiService` encapsula chamadas HTTP para upload, download e pré‑visualização de arquivos. O token de autenticação é obtido dinamicamente antes de cada requisição.
- **Gestão de atividades**: Os componentes `HomeComponent` e `DialogContentComponent` exibem, filtram e editam atividades. O `HomeComponent` usa paginação com tamanho padrão de 10 itens por página e reagenda a consulta sempre que uma alteração ocorre.
- **Comunicação entre componentes**: O `LinkStateService` usa `BehaviorSubject` para notificar componentes sobre a necessidade de recarregar dados. Um `BehaviorSubject` mantém o valor corrente e emite este valor imediatamente para novos assinantes, garantindo que todos os componentes fiquem sincronizados【719983014719284†L203-L227】.

## Estrutura de Pasta

```text
src/
  app/
    components/              # Componentes de alto nível (Home, Header, Footer, DialogContent)
    core/                    # Interceptores e módulos do núcleo
  shared/
    components/              # Componentes reutilizáveis (input-file, uploader, quill, mat-chips, show-file)
    models/                  # Interfaces e modelos
    pipe/                    # Pipes personalizados (duration, hora-formatada)
    request/                 # Interfaces de requisições
    response/                # Interfaces de respostas
    services/                # Serviços de acesso a dados e utilitários
    state/                   # Serviços de estado compartilhado (ex.: LinkStateService)
    utils/                   # Funções utilitárias reutilizáveis
```

## Componentes e Classes Principais

### InputFileComponent

Componente responsável por seleção e processamento de arquivos. Principais responsabilidades:

- Permitir seleção múltipla de arquivos via `<input type="file">` ou `drag & drop`.
- Compactar arquivos com gzip e calcular hashes SHA‑256 de forma assíncrona, exibindo progresso ao usuário.
  - Construir uma pré‑visualização das imagens usando `URL.createObjectURL`. Para anexos que **não são imagens**, exibe uma miniatura de tamanho fixo (150 × 96 px) com um ícone apropriado do Font Awesome (PDF, Word, Excel etc.)【416792451111308†L790-L811】 e a palavra **File** abaixo do ícone. Essa abordagem evita thumbnails vazias e garante consistência visual.
  - Emitir eventos `processed` (arquivo processado), `error` (falha de processamento), `removedAt` (miniatura removida) e `cleared` (lista de miniaturas limpa).

Campos de entrada:
- `accept`: MIME types aceitos (ex.: `'image/*'` ou `'application/pdf'`).
- `maxBytes`: tamanho máximo permitido.
- `includeBase64`: se `true`, inclui a base64 do payload.
- `hashMode`: mantenha `binary` para gerar o hash do binário final.
- `gzipLevel`: nível de compressão.
- `allowMultiple`, `previews`.

Principais métodos públicos:
- `processFile(file: File)`: executa o pipeline de compressão, hash e preview.
- `clear()`: limpa pré‑visualizações.
- `addPreviewsFromFileIds(ids: number[], cleanBefore = false)`: carrega thumbnails a partir de IDs já existentes no backend.

### UploaderComponent

Componente de mais alto nível que encapsula `InputFileComponent` e envia os arquivos processados ao backend:

- Armazena em fila (`queue`) os objetos `ProcessedFile` emitidos por `InputFileComponent`.
- Monta `FormData` com os metadados corretos (tipo de conteúdo, tamanho original, hash etc.) e chama `FileApiService.upload` para cada item.
- Emite eventos `removedAt`, `processed`, `error` e `cleared` para o componente pai.
- Permite adicionar pré‑visualizações a partir de IDs já salvos (`addPreviewsFromFileIds(ids, cleanBefore)`).

### ShowFileComponent

Renderiza um único arquivo previamente salvo:

- Recupera um snapshot `ProcessedSnapshot` do `sessionStorage`, restaura o arquivo original com `restoreFilesFromSnapshot`, valida o hash e decide a melhor forma de renderizar:
  - Imagem → `<img [src]>`.
  - Texto (CSV, JSON) → `<pre>`.
  - PDF → `<iframe>`.
  - Outros tipos → exibe mensagem para baixar.
- Permite baixar o arquivo original via botão.

### HomeComponent

Página principal com listagem paginada de atividades:

- Obtém dados do backend via `HomeService.getLinks(pageIndex, pageSize, excessao, categoria, tag)`.
- Usa `MatPaginator` para paginação. O tamanho da página padrão é 10.
- Permite filtro por categoria e tag.
- Abre `DialogContentComponent` para criar/editar registros.
- Remove atividades com `HomeService.deleteLink(id)`.

### DialogContentComponent

Janela modal para criação/edição de atividades:

- Contém um `FormGroup` reativo mapeado ao modelo `ILinkRequest`.
- Normaliza tags, URIs e arquivos utilizando `LinkMapperService`.
- Usa `InputFileComponent` e `UploaderComponent` para anexar novos arquivos e exibir miniaturas existentes.
- Implementa um cronômetro regressivo (`countdown`) para timesheet.

### Serviços

- **HomeService**: encapsula chamadas REST relacionadas a atividades (`getLinks`, `postLink`, `putLink`, `deleteLink`, `getCategorias`, `getTags`). Calcula horas com `calcularHoras` e `totalHorasTimeSheet`.
  - **FileApiService**: oferece métodos para upload de arquivos (`upload`, `uploadOne`), download (`download`), obter snapshots (`getSnapshot`) e construir thumbnails a partir de IDs. O token de autorização é recuperado dinamicamente antes de cada requisição.
    * Métodos internos de apoio: `guessImageMimeByExt(ext)` (infere MIME de imagem pela extensão), `isImageLike(mime, filename?)` (determina se um conteúdo é imagem), `authHeaders()` (monta cabeçalhos com JWT), `toPureArrayBuffer(view)` (extrai `ArrayBuffer` puro), `gunzip(u8)` (descomprime gzip via API nativa ou *pako*), `payloadToFile(payload)` (converte payload de bytes em `File`), `fileToObjectUrl(file)` (cria URL temporária), `revokeObjectUrl(url)` (revoga URL temporária), `toFormData(processedFile)` (constrói `FormData` com metadados), `download(id)` (baixa o arquivo original), `buildPreviewsFromFileIds(ids)` (gera thumbnails apenas para imagens) e `_buildPreviewsFromFileIds(ids)` (versão que inclui arquivos não‑imagem).
- **FilePreviewBusService**: barramento simples com `Subject` para solicitar carregamento de pré‑visualizações. Utilizado para desacoplar `InputFileComponent` do seu consumidor.
- **ComportamentoService**: mantém uma lista de comportamentos (links) em `BehaviorSubject`.
- **LinkStateService**: expõe um `BehaviorSubject` que emite sinal de refresh. `BehaviorSubject` garante que novos assinantes recebam o valor corrente assim que se inscrevem【719983014719284†L203-L227】.
- **LinkMapperService**: converte tags, URIs e anexos para o formato esperado pelo backend; ajusta strings para título (`toTitleCase`) e datas para ISO.
- **LoginService**: executa autenticação e armazena o token JWT no `localStorage`.
- **SnackService**: encapsula o `MatSnackBar` para exibir mensagens por 5 s no canto superior direito.

### Utilitários

- **common.ts**: funções de utilidade (verificar se string é vazia, normalização de texto, conversão de datas ISO, `trackById` para *ngFor*, parse seguro de números, tratamento de erros HTTP).
  - **file-utils.ts**: coleção de funções para manipulação de dados binários.
    * `base64ToUint8(b64)`: decodifica uma string Base64 em `Uint8Array` de forma eficiente.
    * `sha256Hex(buf)`: calcula o hash SHA‑256 de um `BufferSource` (ex.: `Uint8Array` ou `ArrayBuffer`) retornando uma string hexadecimal de 64 caracteres.
    * `sha256HexOfString(s)`: calcula o hash SHA‑256 de uma string UTF‑8.
    * `toArrayBuffer(view)`: obtém um `ArrayBuffer` puro a partir de um `TypedArray`, respeitando `byteOffset` e `byteLength`.
    * `gunzip(u8)`: descomprime bytes gzip (usa API nativa `DecompressionStream` se disponível; caso contrário utiliza `pako.ungzip`).
    * `downloadFile(file)`: dispara o download de um `File` gerando uma URL de objeto temporária e clicando em um link oculto.
    * `restoreFilesFromSnapshot(snap, validateHash?)`: reconstrói dois arquivos (`.gz` e original) a partir de um snapshot (`ProcessedSnapshot`), valida o hash opcionalmente e devolve `{ gzipFile, originalFile, hashOk }`.
  - **file-selection.util.ts**: utilidades para manipular listas de anexos.
    * `extractIds(previews)`: retorna apenas os IDs numéricos válidos dos previews na ordem em que aparecem.
    * `idToFilename(previews)`: cria um `Map` de ID para nome de arquivo.
    * `diffRemovedIds(prev, curr)`: devolve IDs que estavam na lista anterior e não estão mais presentes na lista atual.
    * `upsertFileRef(list, ref)`: adiciona ou atualiza um `FileRef` de forma imutável, deduplicando pelo ID.
    * `removeById(list, id)`: remove um item por ID de forma imutável.
    * `mergeExistingAndNew(existingIds, idNameMap, newRefs)`: mescla IDs existentes com novos arquivos retornando um payload no formato esperado pelo backend.
  - **quill-configuration.ts**: exporta opções de toolbar e configuração para o `ngx-quill`.
    * `QuillToolbarOptions`: array com grupos de botões (fonte, tamanho, formatação, listas, script, alinhamento etc.).
    * `QuillConfiguration`: objeto de configuração cujas `modules.toolbar` apontam para `QuillToolbarOptions`; pode ser estendido para incluir módulos extras como histórico ou área de transferência.

## Testes

Este repositório inclui testes unitários abrangentes (`*.spec.ts`) para cada módulo e utilitário. Os testes utilizam *Jasmine* e *Karma* para validar:

- Criação de módulos e componentes (`AppModule`, `AppRoutingModule`, `LinkStateService` etc.).
- Funções utilitárias de `common.ts`, `file-selection.util.ts` e `file-utils.ts`.
- Métodos dos serviços (`HomeService`, `FileApiService`, `ComportamentoService`) com mocks de HTTP.
- Comportamento do `InputFileComponent` ao processar arquivos, incluindo compressão e cálculo de hash.

Para executar os testes, use:

```bash
npm install
ng test
```

## Execução

1. Instale dependências com `npm install`.
2. Inicie o servidor de desenvolvimento:

   ```bash
   ng serve
   ```
   A aplicação será exposta em `http://localhost:4200/`.
3. Para build de produção:

   ```bash
   ng build --configuration production
   ```
   Os artefatos serão gerados em `dist/`. O modo de produção utiliza `environment.prod.ts` com `production = true`.

## Observações

- O sistema utiliza Angular Material para componentes visuais e `ngx‑quill` para edição rich‑text.
- Os ícones de arquivos provêm do Font Awesome e a lista completa de ícones de tipos de arquivo (PDF, Word, Excel etc.) pode ser consultada na documentação【416792451111308†L790-L811】.
- O uso de `BehaviorSubject` no `LinkStateService` assegura que novos componentes recebam sempre o valor mais recente assim que se inscrevem【719983014719284†L203-L227】.
- O token JWT de autenticação é armazenado no `localStorage` pelo `LoginService` e utilizado dinamicamente pelo `FileApiService` e `HomeService` para autenticar as requisições HTTP.

# 🔐 Autenticação 2FA - Angular + Java

### Fluxo
1. O usuário preenche email e senha.
2. O Angular valida os campos e gera hash SHA-256 local.
3. O backend valida credenciais e dispara o 2FA (TOTP).
4. O usuário insere o código do Authenticator.
5. Após verificação, o sistema gera token JWT e redireciona ao dashboard.

### Segurança
- Senha nunca trafega em texto puro.
- TOTP compatível com Google/Microsoft Authenticator.
- JWT armazena sessão temporária (expiração configurável).

### Testes
```bash
ng test --code-coverage

# 🔐 Token Lifecycle Management

### Duração
- JWT: 15 minutos
- Refresh Token: 7 dias

### Mecanismos
1. O token é validado localmente pelo front via `exp` claim.
2. O `TokenInterceptor` adiciona o token a cada requisição e redireciona para `/login` se estiver expirado.
3. O `AuthGuard` impede acesso a rotas protegidas.
4. (Opcional) O `refreshToken()` renova automaticamente tokens próximos da expiração.

### Configuração backend (Java)
`jwt.expiration=900000  # 15 minutos`
