export interface ILinksResponse {
    id: number;
    name: string;
    url: string;
    categoria: string;
    subCategoria: string;
    descricao: string;
    tag: Record<string, any>;
}
