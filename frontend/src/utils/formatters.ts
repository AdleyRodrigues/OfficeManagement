// Funções de formatação

/**
 * Formata uma data ISO para formato brasileiro
 */
export const formatDate = (isoDate: string | undefined): string => {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR');
};

/**
 * Formata booleanos para Sim/Não
 */
export const formatBoolean = (value: boolean | undefined): string => {
    if (value === undefined) return '';
    return value ? 'Sim' : 'Não';
}; 