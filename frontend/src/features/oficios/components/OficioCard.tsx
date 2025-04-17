import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Card, CardContent, Chip, IconButton, Typography } from '@mui/material';
import React from 'react';
import { OficioItem } from '../types';

interface OficioCardProps {
    oficio: OficioItem;
    onEdit: (id: number) => void;
    onDelete?: (id: number) => void;
}

const OficioCard: React.FC<OficioCardProps> = ({ oficio, onEdit, onDelete }) => {
    return (
        <Card
            variant="outlined"
            sx={{
                mb: 2,
                borderLeft: `4px solid ${oficio.utilizado ? '#4caf50' : '#9e9e9e'}`,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="h6" color="primary">
                            Ofício Nº {oficio.numero}/{oficio.ano}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {oficio.cidade}
                        </Typography>
                    </Box>

                    <Chip
                        label={oficio.utilizado ? "Utilizado" : "Não Utilizado"}
                        sx={{
                            backgroundColor: oficio.utilizado ? "#4caf50" : "#9e9e9e",
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.75rem'
                        }}
                    />
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        <strong>Remetente:</strong> {oficio.remetente}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Destinatário:</strong> {oficio.destinatario}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {oficio.descricao}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <IconButton color="primary" onClick={() => onEdit(oficio.id)} size="small">
                        <EditIcon />
                    </IconButton>

                    {onDelete && (
                        <IconButton color="error" onClick={() => onDelete(oficio.id)} size="small">
                            <DeleteIcon />
                        </IconButton>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default OficioCard; 