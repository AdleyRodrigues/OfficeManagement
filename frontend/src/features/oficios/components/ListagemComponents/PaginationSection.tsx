import React from 'react';
import { Box, Typography, Pagination } from '@mui/material';

interface PaginationSectionProps {
    totalPages: number;
    page: number;
    onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const PaginationSection: React.FC<PaginationSectionProps> = ({
    totalPages,
    page,
    onPageChange
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 3,
                backgroundColor: '#f5f5f5',
                p: 2,
                borderRadius: '4px'
            }}
        >
            <Pagination
                count={totalPages}
                page={page}
                onChange={onPageChange}
                color="primary"
                showFirstButton
                showLastButton
                sx={{
                    '& .MuiPaginationItem-root': {
                        fontWeight: 'medium'
                    }
                }}
            />
        </Box>
    );
};

export default PaginationSection; 