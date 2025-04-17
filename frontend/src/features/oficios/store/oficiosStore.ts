import axios from 'axios';
import { create } from 'zustand';
import { OficioItem } from '../types';
import { config } from '../../../config/env';

const API_ENDPOINT = `${config.api.baseUrl}${config.api.endpoints.oficios}`;

interface OficiosStore {
    oficios: OficioItem[];
    loading: boolean;
    error: string | null;
    fetchOficios: () => Promise<void>;
    addOficio: (oficio: Omit<OficioItem, 'id' | 'numero'>) => Promise<void>;
    updateOficio: (id: number, oficio: Partial<OficioItem>) => Promise<void>;
    deleteOficio: (id: number) => Promise<void>;
}

export const useOficiosStore = create<OficiosStore>((set) => ({
    oficios: [],
    loading: false,
    error: null,

    fetchOficios: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(API_ENDPOINT, {
                timeout: config.api.timeout
            });
            set({ oficios: response.data, loading: false });
        } catch (error) {
            set({
                error: 'Erro ao carregar ofícios: ' + (error instanceof Error ? error.message : 'Erro desconhecido'),
                loading: false
            });
        }
    },

    addOficio: async (oficio) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(API_ENDPOINT, oficio, {
                timeout: config.api.timeout
            });
            set((state) => ({
                oficios: [...state.oficios, response.data],
                loading: false
            }));
        } catch (error) {
            set({
                error: 'Erro ao adicionar ofício: ' + (error instanceof Error ? error.message : 'Erro desconhecido'),
                loading: false
            });
            throw error;
        }
    },

    updateOficio: async (id, oficio) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.put(`${API_ENDPOINT}/${id}`, oficio, {
                timeout: config.api.timeout
            });
            set((state) => ({
                oficios: state.oficios.map((o) => (o.id === id ? { ...o, ...response.data } : o)),
                loading: false
            }));
        } catch (error) {
            set({
                error: 'Erro ao atualizar ofício: ' + (error instanceof Error ? error.message : 'Erro desconhecido'),
                loading: false
            });
            throw error;
        }
    },

    deleteOficio: async (id) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`${API_ENDPOINT}/${id}`, {
                timeout: config.api.timeout
            });
            set((state) => ({
                oficios: state.oficios.filter((o) => o.id !== id),
                loading: false
            }));
        } catch (error) {
            set({
                error: 'Erro ao excluir ofício: ' + (error instanceof Error ? error.message : 'Erro desconhecido'),
                loading: false
            });
            throw error;
        }
    }
})); 