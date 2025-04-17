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
            sx={{ height: '200px' }}
        >
            <CircularProgress size={60} thickness={4} />
            <Typography variant="body1" color="primary" sx={{ mt: 2, fontWeight: 'medium' }}>
                Carregando ofícios...
            </Typography>
        </Box>
    );
};

export default LoadingIndicator; 