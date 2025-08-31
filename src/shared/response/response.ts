export interface ILinksResponse {
    id: number;
    name: string;
    url: string;
    uri: any;
    categoria: string;
    subCategoria: string;
    descricao: string;
    tag: Record<string, any>;
    dataEntradaManha: string | null;
    dataSaidaManha: string | null;
    dataEntradaTarde: string | null;
    dataSaidaTarde: string | null;
    dataEntradaNoite: string | null;
    dataSaidaNoite: string | null;
}
