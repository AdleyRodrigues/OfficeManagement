import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LabelIcon from '@mui/icons-material/Label';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Chip,
    FormControl,
    Grid,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import React from 'react';
import { OficiosFilterParams } from '../types';

interface FiltrosOficiosProps {
    filters: OficiosFilterParams;
    years: number[];
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onYearChange: (e: SelectChangeEvent) => void;
    onUsedChange: (e: SelectChangeEvent) => void;
    onFilter: () => void;
    onClearFilters: () => void;
}

const FiltrosOficios: React.FC<FiltrosOficiosProps> = ({
    filters,
    years,
    onSearchChange,
    onYearChange,
    onUsedChange
}) => {
    return (
        <Grid container spacing={2}>
            {/* Campo de pesquisa */}
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SearchIcon fontSize="small" sx={{ mr: 1, color: '#1976d2' }} />
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 'bold',
                            color: '#555'
                        }}
                    >
                        Pesquisar
                    </Typography>
                </Box>
                <TextField
                    placeholder="Número, remetente, destinatário..."
                    variant="outlined"
                    fullWidth
                    value={filters.search}
                    onChange={onSearchChange}
                    size="small"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: '#1976d2',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#1976d2',
                                borderWidth: '1px',
                            },
                        },
                    }}
                />
            </Grid>

            {/* Seletor de Ano */}
            <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: '#1976d2' }} />
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 'bold',
                            color: '#555'
                        }}
                    >
                        Ano
                    </Typography>
                </Box>
                <FormControl fullWidth size="small">
                    <Select
                        value={filters.year?.toString() || ''}
                        onChange={onYearChange}
                        displayEmpty
                        sx={{
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#1976d2',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#1976d2',
                                borderWidth: '1px',
                            },
                            height: '40px',
                        }}
                        renderValue={(selected) => {
                            if (!selected) {
                                return <Typography sx={{ color: 'text.secondary' }}>Todos</Typography>;
                            }
                            return <Chip
                                size="small"
                                label={selected}
                                sx={{
                                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                                    fontWeight: 'bold',
                                    color: '#1976d2'
                                }}
                            />;
                        }}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        {years.map(year => (
                            <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            {/* Seletor de Status */}
            <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LabelIcon fontSize="small" sx={{ mr: 1, color: '#1976d2' }} />
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 'bold',
                            color: '#555'
                        }}
                    >
                        Status
                    </Typography>
                </Box>
                <FormControl fullWidth size="small">
                    <Select
                        value={filters.isUsed === undefined ? '' : filters.isUsed.toString()}
                        onChange={onUsedChange}
                        displayEmpty
                        sx={{
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#1976d2',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#1976d2',
                                borderWidth: '1px',
                            },
                            height: '40px',
                        }}
                        renderValue={(selected) => {
                            if (!selected) {
                                return <Typography sx={{ color: 'text.secondary' }}>Todos</Typography>;
                            }
                            return <Chip
                                size="small"
                                label={selected === 'true' ? 'Utilizado' : 'Não Utilizado'}
                                sx={{
                                    bgcolor: selected === 'true'
                                        ? 'rgba(76, 175, 80, 0.1)'
                                        : 'rgba(158, 158, 158, 0.1)',
                                    fontWeight: 'bold',
                                    color: selected === 'true' ? '#4caf50' : '#9e9e9e'
                                }}
                            />;
                        }}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="true">Utilizado</MenuItem>
                        <MenuItem value="false">Não Utilizado</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default FiltrosOficios; 