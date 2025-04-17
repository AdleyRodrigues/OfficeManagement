export interface OficioItem {
    id: number;
    numero: number;
    ano: number;
    remetente: string;
    destinatario: string;
    cidade: string;
    utilizado: boolean;
    descricao?: string;
    assunto?: string;
    dataEnvio?: string | null;
}

export interface OficiosPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export interface OficiosResponse {
    data: OficioItem[];
    pagination: OficiosPagination;
}

export interface OficiosFilterParams {
    page?: number;
    pageSize?: number;
    search?: string;
    year?: number;
    isUsed?: boolean;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
} 