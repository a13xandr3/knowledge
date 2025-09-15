export interface ILinkRequest {
    id: number;
    name: string;
    uri: any;
    categoria: string;
    subCategoria: string;
    descricao: string;
    tag: any;
    horas: unknown;
    oldCategoria?: string;
    showSite?: boolean
    dataEntradaManha: string;
    dataSaidaManha: string;
    dataEntradaTarde: string;
    dataSaidaTarde: string;
    dataEntradaNoite: string;
    dataSaidaNoite: string;
    totalHorasDia?: number;
}

export interface IactionStatus extends ILinkRequest {
    status: string;
}

export interface Timesheet {
    dataEntradaManha: string;
    dataSaidaManha: string;
    dataEntradaTarde: string;
    dataSaidaTarde: string;
    dataEntradaNoite: string;
    dataSaidaNoite: string;
};