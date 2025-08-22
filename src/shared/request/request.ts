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
}

export interface IactionStatus extends ILinkRequest {
    status: string;
}