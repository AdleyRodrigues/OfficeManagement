import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Container,
    SelectChangeEvent,
    Table,
    TableBody,
    TableContainer,
    useMediaQuery,
    useTheme,
    Paper,
    Typography
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import axios from 'axios';
import { EditarOficioModal } from '..';
import AdicionarOficioModal from '../components/AdicionarOficioModal';
import FiltrosOficios from '../components/FiltrosOficios';
import '../styles/global.css';
import { OficioItem, OficiosFilterParams } from '../types';
import {
    TableHeader,
    OficioTableRow,
    LoadingIndicator,
    EmptyState,
    PaginationSection,
    PageHeader,
    OficioCard,
    SortButton
} from '../components/ListagemComponents';
import { config } from '../../../config/env';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';

// URL da API - PostgreSQL
const API_ENDPOINT = `${config.api.baseUrl}${config.api.endpoints.oficios}`;
const SERVER_TEST_ENDPOINT = `${config.api.baseUrl}${config.api.endpoints.serverTest}`;

const ListagemOficios: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [loading, setLoading] = useState(true);
    const [oficios, setOficios] = useState<OficioItem[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(true);
    const [, setError] = useState<string | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedOficioId, setSelectedOficioId] = useState<number | undefined>(undefined);
    const [selectedOficio, setSelectedOficio] = useState<OficioItem | undefined>(undefined);
    const isInitialRender = useRef(true);
    const initialFetchDone = useRef(false);

    const [filters, setFilters] = useState<OficiosFilterParams>({
        page: 1,
        pageSize: 10,
        search: '',
        year: undefined,
        isUsed: undefined,
        sortBy: 'numero',
        sortDirection: 'desc'
    });

    // Função para verificar se o servidor está online
    const checkServerStatus = async () => {
        try {
            const response = await axios.get(SERVER_TEST_ENDPOINT, { timeout: config.api.serverTestTimeout });
            console.log('Servidor online:', response.data);
            return true;
        } catch (error) {
            console.error('Servidor offline ou inacessível:', error);
            return false;
        }
    };

    const fetchOficios = async () => {
        if (!initialFetchDone.current) {
            initialFetchDone.current = true;
        } else {
            setLoading(true);
        }

        setError(null);

        const isServerOnline = await checkServerStatus();
        if (!isServerOnline) {
            setError('Servidor offline ou inacessível. Verifique se o backend está rodando na porta 3001.');
            setOficios([]);
            setLoading(false);
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append('page', String(filters.page || 1));
            params.append('limit', String(filters.pageSize || 10));

            if (filters.search && filters.search.trim() !== '') {
                params.append('busca', filters.search.trim());
            }

            if (filters.year !== undefined) {
                params.append('ano', String(filters.year));
            }

            if (filters.isUsed !== undefined) {
                params.append('utilizado', String(filters.isUsed));
            }

            const response = await axios.get(API_ENDPOINT, {
                params,
                timeout: config.api.timeout
            });

            if (response.data && response.data.data) {
                setOficios(response.data.data);
                setTotalPages(response.data.pagination.totalPages || 1);
            } else {
                setOficios([]);
                setTotalPages(1);
            }
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.data?.error === "Erro ao consultar oficios" &&
                typeof error.response?.data?.details === 'string' &&
                (
                    error.response.data.details.includes("operador não existe") ||
                    error.response.data.details.includes("integer") ||
                    error.response.data.details.includes("unknown") ||
                    error.response.data.details.includes("não existe")
                )
            ) {
                setOficios([]);
                setTotalPages(1);
                setError(null);
                setLoading(false);
                return;
            }

            if (
                axios.isAxiosError(error) &&
                error.response?.status === 500 &&
                filters.search &&
                filters.search.trim() !== ''
            ) {
                setOficios([]);
                setTotalPages(1);
                setError(null);
                setLoading(false);
                return;
            }

            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNREFUSED') {
                    setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
                } else if (error.response?.status === 500) {
                    setError('Erro interno no servidor (500). Verifique os logs do backend para mais detalhes.');
                } else {
                    setError(`Erro na requisição: ${error.message}`);
                }
            } else {
                setError('Não foi possível carregar os ofícios: ' +
                    (error instanceof Error ? error.message : 'Erro desconhecido'));
            }

            setOficios([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOficios();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        fetchOficios();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.page]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setFilters(prev => ({ ...prev, page: value }));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
    };

    const handleYearChange = (e: SelectChangeEvent) => {
        const year = e.target.value ? parseInt(e.target.value) : undefined;
        setFilters(prev => ({ ...prev, year }));
    };

    const handleUsedChange = (e: SelectChangeEvent) => {
        let isUsed;
        if (e.target.value === 'true') isUsed = true;
        else if (e.target.value === 'false') isUsed = false;
        else isUsed = undefined;
        setFilters(prev => ({ ...prev, isUsed }));
    };

    const handleFilter = () => {
        setFilters(prev => ({ ...prev, page: 1 }));
        fetchOficios();
    };

    const handleClearFilters = () => {
        setFilters({
            page: 1,
            pageSize: 10,
            search: '',
            year: undefined,
            isUsed: undefined,
            sortBy: 'numero',
            sortDirection: 'desc'
        });
        fetchOficios();
    };

    const handleEditOficio = (id: number) => {
        const oficio = oficios.find(o => o.id === id);
        if (oficio) {
            setSelectedOficioId(oficio.id);
            setSelectedOficio(oficio);
            setEditModalOpen(true);
        }
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedOficioId(undefined);
        setSelectedOficio(undefined);
    };

    const handleSuccess = () => {
        fetchOficios();
    };

    const handleEditSuccess = () => {
        fetchOficios();
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handleTryAgain = () => {
        handleClearFilters();
    };

    const handleSort = (field: string, direction: 'asc' | 'desc') => {
        setFilters(prev => ({
            ...prev,
            sortBy: field,
            sortDirection: direction,
            page: 1
        }));
        fetchOficios();
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const renderDesktopView = () => (
        <TableContainer sx={{
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            marginTop: 3
        }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHeader />
                <TableBody>
                    {oficios.map((oficio) => (
                        <OficioTableRow
                            key={oficio.id}
                            oficio={oficio}
                            onEdit={handleEditOficio}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderMobileView = () => (
        <Box sx={{ mt: 3 }}>
            {oficios.map((oficio) => (
                <OficioCard
                    key={oficio.id}
                    oficio={oficio}
                    onEdit={handleEditOficio}
                />
            ))}
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 2 }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mb: 3
            }}>
                <PageHeader isMobile={isMobile} />

                {/* Botões principais */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 2,
                    width: '100%'
                }}>
                    <AdicionarOficioModal onSuccess={handleSuccess} />

                    <Box sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: 1,
                        flex: 1
                    }}>
                        <Button
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            onClick={toggleFilters}
                            size="medium"
                            fullWidth
                            sx={{
                                height: '48px',
                                backgroundColor: showFilters ? 'rgba(25, 118, 210, 0.08)' : 'transparent'
                            }}
                        >
                            {showFilters ? 'Esconder Opções de Filtro' : 'Mostrar Opções de Filtro'}
                        </Button>

                        <SortButton
                            onSort={handleSort}
                            currentSortField={filters.sortBy}
                            currentSortDirection={filters.sortDirection}
                        />
                    </Box>
                </Box>
            </Box>

            {showFilters && (
                <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f8f9fa' }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium', color: '#1976d2' }}>
                            Opções de Filtro
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Use os campos abaixo para encontrar ofícios específicos
                        </Typography>
                    </Box>

                    <FiltrosOficios
                        filters={filters}
                        onSearchChange={handleSearchChange}
                        onYearChange={handleYearChange}
                        onUsedChange={handleUsedChange}
                        onFilter={handleFilter}
                        onClearFilters={handleClearFilters}
                        years={years}
                    />

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1,
                        mt: 2,
                        flexDirection: isMobile ? 'column' : 'row'
                    }}>
                        <Button
                            variant="outlined"
                            onClick={handleClearFilters}
                            fullWidth={isMobile}
                            startIcon={<RefreshIcon />}
                        >
                            Limpar Filtros
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleFilter}
                            fullWidth={isMobile}
                            startIcon={<SearchIcon />}
                        >
                            Buscar Ofícios
                        </Button>
                    </Box>
                </Paper>
            )}

            {loading ? (
                <LoadingIndicator />
            ) : oficios.length === 0 ? (
                <EmptyState onTryAgain={handleTryAgain} />
            ) : (
                <>
                    {isMobile ? renderMobileView() : renderDesktopView()}
                    <PaginationSection
                        page={filters.page || 1}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            <EditarOficioModal
                open={editModalOpen}
                onClose={handleCloseEditModal}
                onSuccess={handleEditSuccess}
                oficioId={selectedOficioId}
                oficioData={selectedOficio}
            />
        </Container>
    );
};

export default ListagemOficios; 