export interface ILinks {
    atividades: ILinksResponse[],
    total: number;
}
export interface ILinksResponse {
    id: number;
    name: string;
    uri: unknown;
    categoria: string;
    subCategoria?: string;
    descricao: string;
    tag: unknown;
    dataEntradaManha?: string | null;
    dataSaidaManha?: string | null;
    dataEntradaTarde?: string | null;
    dataSaidaTarde?: string | null;
    dataEntradaNoite?: string | null;
    dataSaidaNoite?: string | null;
    totalHorasDia?: number | null;
}