import React from 'react';
import { TableRow, TableCell, Chip, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { OficioItem } from '../../types';

interface OficioTableRowProps {
    oficio: OficioItem;
    onEdit: (id: number) => void;
}

const OficioTableRow: React.FC<OficioTableRowProps> = ({ oficio, onEdit }) => {
    return (
        <TableRow
            hover
            sx={{
                '&:nth-of-type(odd)': {
                    backgroundColor: '#f9f9f9',
                },
                '&:last-child td, &:last-child th': {
                    borderBottom: 0
                },
                '&:hover': {
                    backgroundColor: '#f1f8fe',
                }
            }}
        >
            <TableCell
                sx={{
                    color: '#1976d2',
                    fontWeight: 'bold',
                    borderRight: '1px solid #e0e0e0',
                    width: '80px',
                    textAlign: 'center'
                }}
            >
                {String(oficio.numero).padStart(2, '0')}
            </TableCell>
            <TableCell
                sx={{
                    borderRight: '1px solid #e0e0e0',
                    width: '80px',
                    textAlign: 'center',
                    color: '#1976d2',
                    fontWeight: 'bold'
                }}
            >
                {oficio.ano}
            </TableCell>
            <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>
                {oficio.remetente}
            </TableCell>
            <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>
                {oficio.destinatario}
            </TableCell>
            <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>
                {oficio.cidade}
            </TableCell>
            <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>
                <Chip
                    label={oficio.utilizado ? "Utilizado" : "Não Utilizado"}
                    sx={{
                        backgroundColor: oficio.utilizado ? "#4caf50" : "#9e9e9e",
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        height: '24px'
                    }}
                />
            </TableCell>
            <TableCell
                sx={{
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    borderRight: '1px solid #e0e0e0'
                }}
            >
                {oficio.descricao}
            </TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <IconButton
                        color="primary"
                        onClick={() => onEdit(oficio.id)}
                        size="small"
                        sx={{
                            mx: 0.5,
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.15)',
                            }
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Box>
            </TableCell>
        </TableRow>
    );
};

export default OficioTableRow; 