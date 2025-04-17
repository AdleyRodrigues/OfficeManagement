import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import RefreshIcon from '@mui/icons-material/Refresh';

interface EmptyStateProps {
    onTryAgain: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onTryAgain }) => {
    return (
        <Box
            textAlign="center"
            py={6}
            sx={{
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                mt: 3,
                border: '1px dashed #ccc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px'
            }}
        >
            <Box
                sx={{
                    color: '#aaa',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#f0f0f0'
                }}
            >
                <DescriptionIcon sx={{ fontSize: '32px' }} />
            </Box>

            <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                Nenhum ofício encontrado
            </Typography>

            <Typography variant="body2" sx={{ color: '#888', mb: 3, maxWidth: '80%' }}>
                Não foram encontrados ofícios com os filtros selecionados. Tente alterar os critérios de busca.
            </Typography>

            <Button
                variant="outlined"
                onClick={onTryAgain}
                startIcon={<RefreshIcon />}
                sx={{
                    borderRadius: '20px',
                    px: 3
                }}
            >
                Limpar filtros e tentar novamente
            </Button>
        </Box>
    );
};

export default EmptyState; 