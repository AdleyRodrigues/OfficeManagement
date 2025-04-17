import React from 'react';
import { Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';

interface PageHeaderProps {
    isMobile: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ isMobile }) => {
    return (
        <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
                color: '#1976d2',
                borderBottom: '2px solid #1976d2',
                pb: 1,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                fontSize: isMobile ? '1.5rem' : '2.125rem'
            }}
        >
            <DescriptionIcon sx={{ mr: 1.5, fontSize: isMobile ? '1.5rem' : '1.8rem' }} />
            Gerenciamento de Ofícios
        </Typography>
    );
};

export default PageHeader; 