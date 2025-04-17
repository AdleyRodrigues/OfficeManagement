import React from 'react';
import {
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Box,
    Typography
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface SortOption {
    label: string;
    value: string;
}

interface SortButtonProps {
    onSort: (field: string, direction: 'asc' | 'desc') => void;
    currentSortField?: string;
    currentSortDirection?: 'asc' | 'desc';
}

const sortOptions: SortOption[] = [
    { label: 'Ordenar por Número', value: 'numero' },
    { label: 'Ordenar por Ano', value: 'ano' },
    { label: 'Ordenar por Remetente', value: 'remetente' },
    { label: 'Ordenar por Destinatário', value: 'destinatario' }
];

const SortButton: React.FC<SortButtonProps> = ({
    onSort,
    currentSortField = 'numero',
    currentSortDirection = 'desc'
}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSortSelect = (field: string) => {
        const newDirection = field === currentSortField && currentSortDirection === 'asc' ? 'desc' : 'asc';
        onSort(field, newDirection);
        handleClose();
    };

    const getCurrentSortLabel = () => {
        const option = sortOptions.find(opt => opt.value === currentSortField);
        const direction = currentSortDirection === 'asc' ? '(A-Z)' : '(Z-A)';
        return option ? `${option.label} ${direction}` : 'Ordenar Lista';
    };

    return (
        <>
            <Button
                onClick={handleClick}
                startIcon={<SortIcon />}
                variant="outlined"
                size="medium"
                fullWidth
                sx={{
                    height: '48px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: 0,
                    backgroundColor: open ? 'rgba(25, 118, 210, 0.08)' : 'transparent'
                }}
            >
                {getCurrentSortLabel()}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        maxWidth: '100%',
                        width: anchorEl ? anchorEl.offsetWidth : 'auto',
                        mt: 1
                    }
                }}
            >
                {sortOptions.map((option) => (
                    <MenuItem
                        key={option.value}
                        onClick={() => handleSortSelect(option.value)}
                        selected={currentSortField === option.value}
                        sx={{
                            minHeight: '48px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 1
                        }}
                    >
                        <ListItemText primary={option.label} />
                        {currentSortField === option.value && (
                            <ListItemIcon sx={{ minWidth: 'auto' }}>
                                {currentSortDirection === 'asc' ?
                                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                                        <ArrowUpwardIcon fontSize="small" />
                                        <Typography variant="caption" sx={{ ml: 0.5 }}>A-Z</Typography>
                                    </Box> :
                                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                                        <ArrowDownwardIcon fontSize="small" />
                                        <Typography variant="caption" sx={{ ml: 0.5 }}>Z-A</Typography>
                                    </Box>
                                }
                            </ListItemIcon>
                        )}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default SortButton; 