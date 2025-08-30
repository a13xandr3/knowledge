export interface ILinkRequest {
    id: number;
    name: string;
    url: string;
    categoria: string;
    subCategoria: string;
    descricao: string;
    tag: any;
    oldCategoria?: string;
    showSite?: boolean
    dataEntradaManha: string | null;
    dataSaidaManha: string | null;
    dataEntradaTarde: string | null;
    dataSaidaTarde: string | null;
    dataEntradaNoite: string | null;
    dataSaidaNoite: string | null;
}

export interface IactionStatus extends ILinkRequest {
    status: string;
}