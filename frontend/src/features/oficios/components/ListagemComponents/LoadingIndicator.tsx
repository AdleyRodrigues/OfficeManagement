import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

const LoadingIndicator: React.FC = () => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            my={8}
            sx={{ height: '300px' }}
        >
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" color="primary" sx={{ mt: 3, mb: 1, fontWeight: 'medium' }}>
                Iniciando o servidor...
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', maxWidth: '400px' }}>
                Como estamos usando um servidor gratuito, a primeira requisição pode levar até 50 segundos.
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, textAlign: 'center', maxWidth: '400px' }}>
                Após iniciar, as próximas requisições serão muito mais rápidas! 😊
            </Typography>
        </Box>
    );
};

export default LoadingIndicator; 