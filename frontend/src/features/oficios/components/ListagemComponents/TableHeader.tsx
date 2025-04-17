import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';

const TableHeader: React.FC = () => {
    const headerStyle = {
        fontWeight: 'bold',
        color: 'white',
        borderRight: '1px solid rgba(224, 224, 224, 0.4)',
        py: 2
    };

    const numberHeaderStyle = {
        ...headerStyle,
        width: '80px',
        textAlign: 'center' as const
    };

    return (
        <TableHead sx={{ backgroundColor: '#1976d2' }}>
            <TableRow>
                <TableCell sx={numberHeaderStyle}>NÚMERO</TableCell>
                <TableCell sx={numberHeaderStyle}>ANO</TableCell>
                <TableCell sx={headerStyle}>REMETENTE</TableCell>
                <TableCell sx={headerStyle}>DESTINATÁRIO</TableCell>
                <TableCell sx={headerStyle}>CIDADE</TableCell>
                <TableCell sx={headerStyle}>STATUS</TableCell>
                <TableCell sx={headerStyle}>DESCRIÇÃO</TableCell>
                <TableCell sx={{ ...headerStyle, textAlign: 'center', borderRight: 'none' }}>
                    AÇÕES
                </TableCell>
            </TableRow>
        </TableHead>
    );
};

export default TableHeader; 