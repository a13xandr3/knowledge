# Componentes, Serviços e Classes

_Gerado em 2025-10-19T05:17:59.878245_

Este documento lista `@Input`, `@Output`, `EventEmitter`, métodos e ciclos de vida detectados automaticamente.

## AppRoutingModule  
`class` — **src/app/app-routing.module.ts**

- **Propriedades:** imports (public), exports (public)

## AppComponent  
`component` — **src/app/app.component.ts**

- **Ciclo de vida:** ngOnInit
- **Propriedades:** selector (public)

## AppModule  
`class` — **src/app/app.module.ts**

- **Propriedades:** declarations (public), customOptions (public), exports (public), bootstrap (public)

## DialogContentComponent  
`component` — **src/app/components/dialog-content/dialog-content.component.ts**

- **Ciclo de vida:** ngAfterViewInit, ngOnDestroy, ngOnInit
- **Métodos:** fechar, if, onClearedFiles, onError, onPreviewRemoved, onProcessed
- **Propriedades:** id (public), filename (public), selector (public), fr (public), exibeSite (public), safeUrl (public), previewsFromIds (public), service (private), id (public), name (public), data (public), removeId (public), id (public), filename (public)

## FooterComponent  
`component` — **src/app/components/footer/footer.component.ts**

- **Propriedades:** selector (public)

## HeaderComponent  
`component` — **src/app/components/header/header.component.ts**

- **Ciclo de vida:** ngOnInit
- **Métodos:** abrirDialog, if, onChangeCategory, onChangeTag
- **Propriedades:** selector (public), homeService (private), width (public), id (public)

## HomeComponent  
`component` — **src/app/components/home/home.component.ts**

- **Ciclo de vida:** ngAfterViewInit, ngOnDestroy, ngOnInit
- **Métodos:** if, onChangeTag, onPageChange
- **Propriedades:** selector (public), totalHoras (public), dialog (private), autoFocus (public), id (public), dataEntradaManha (public)

## AuthInterceptor  
`service` — **src/app/core/interceptors/auth.interceptor.ts**

- **Métodos:** if, intercept
- **Propriedades:** setHeaders (public)

## InputFileComponent  
`component` — **src/shared/components/input-file/input-file.component.ts**

- **Ciclo de vida:** ngOnDestroy, ngOnInit
- **Métodos:** clear, for, if, onDragEnter, onDragLeave, onDragOver, onDrop, onFileInputChange
- **Propriedades:** url (public), filename (public), id (public), filename (public), files (public), selector (public), filesSvc (private), width (public), autoFocus (public), filename (public), filename (public), payloadBytes (public), contentEncoding (public), filename (public), type (public), data (public)

## MatChipsComponent  
`component` — **src/shared/components/mat-chips/mat-chips.component.ts**

- **Ciclo de vida:** ngAfterViewInit, ngOnChanges, ngOnInit
- **Métodos:** addChip, if
- **Propriedades:** selector (public), multi (public)

## QuillComponent  
`component` — **src/shared/components/quill/quill.component.ts**

- **Ciclo de vida:** ngOnDestroy
- **Métodos:** if, onBlur, onContentChanged, onEditorCreated, onFocus
- **Propriedades:** selector (public), multi (public)

## ShowFileComponent  
`component` — **src/shared/components/show-file/show-file.component.ts**

- **Ciclo de vida:** ngOnDestroy, ngOnInit
- **Métodos:** download, if
- **Propriedades:** selector (public), dialogRef (public)

## UploaderComponent  
`component` — **src/shared/components/uploader/uploader.component.ts**

- **Métodos:** addPreviewsFromFileIds, download, if, onError, onProcessed, reset, send
- **Propriedades:** selector (public), lastSaved (public), http (private)

## DurationPipe  
`class` — **src/shared/pipe/duration.pipe.ts**

- **Propriedades:** name (public)

## HoraFormatadaPipe  
`class` — **src/shared/pipe/hora-formatada.pipe.ts**

- **Propriedades:** name (public)

## ComportamentoService  
`service` — **src/shared/services/comportamento.service.ts**

- **Propriedades:** id (public), name (public), url (public), providedIn (public)

## FileApiService  
`service` — **src/shared/services/file-api.service.ts**

- **Métodos:** download, if, revokeObjectUrl, switch
- **Propriedades:** providedIn (public), default (public), headers (public), headers (public), payloadBytes (public), contentEncoding (public), filename (public), type (public), type (public), filename (public), type (public), filename (public), type (public), filename (public)

## FilePreviewBusService  
`service` — **src/shared/services/file-preview.bus.service.ts**

- **Propriedades:** ids (public), cleanBefore (public), providedIn (public)

## FileRefModule  
`class` — **src/shared/services/file-ref/file-ref.module.ts**

- **Propriedades:** declarations (public)

## HomeService  
`service` — **src/shared/services/home.service.ts**

- **Propriedades:** providedIn (public), http (private), headers (public), headers (public), headers (public), headers (public), headers (public), name (public), headers (public), name (public), headers (public), headers (public)

## LinkMapperService  
`service` — **src/shared/services/link-mapper.service.ts**

- **Métodos:** if
- **Propriedades:** providedIn (public), day (public), filename (public), id (public), categoria (public), fileID (public), dataEntradaManha (public), id (public), categoria (public), fileID (public), dataEntradaManha (public)

## LoginService  
`service` — **src/shared/services/login.service.ts**

- **Propriedades:** providedIn (public)

## SnackService  
`service` — **src/shared/services/snack.service.ts**

- **Propriedades:** providedIn (public), snackBar (private), duration (public)

## LinkStateService  
`service` — **src/shared/state/link-state-service.ts**

