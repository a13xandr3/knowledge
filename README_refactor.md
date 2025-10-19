# Projeto Refatorado (Angular 15 + TypeScript)

Data: 2025-10-12 17:43:34

## Objetivos da refatoração (seguros e sem quebra de build)
- **Centralização de utilidades** em `src/shared/utils/common.ts` (normalização, trackBy, datas, parsing numérico e tratamento de erro).
- **Remoção de verbosidade de debug** (`console.log` e `debugger`) em todos os TS sob `src/`.
- **Paginação padrão**: força `pageSize = 10` no `HomeComponent` (quando detectado), para garantir o requisito funcional.
- **Nenhuma alteração disruptiva** de APIs públicas, contratos de services, ou assinaturas de componentes.

## Próximos passos sugeridos (opcionais)
- Migrar helpers duplicados nos components/services para `shared/utils/common.ts`.
- Introduzir `BaseService` com tratamento de erros e genéricos comuns (se aplicável).
- Padronizar `trackBy` em *ngFor para otimização de listas.
- Adicionar ESLint/Prettier consistente ao repositório.

## Como usar
- Substitua o projeto original por este diretório `refactored_project`.
- Verifique imports existentes e, quando fizer sentido, utilize helpers de `shared/utils/common.ts`.

## Arquivos gerados
- `shared/utils/common.ts`: utilidades compartilhadas.
- `README_refactor.md`: este resumo.
- `angularDoc.txt` (fora deste diretório): documentação completa, linha a linha, para manutenção por iniciantes.
