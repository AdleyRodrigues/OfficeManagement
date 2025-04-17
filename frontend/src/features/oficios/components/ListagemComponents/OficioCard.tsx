import EditIcon from '@mui/icons-material/Edit';
import { Box, Card, CardContent, Chip, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
import { OficioItem } from '../../types';

interface OficioCardProps {
    oficio: OficioItem;
    onEdit: (id: number) => void;
}

const OficioCard: React.FC<OficioCardProps> = ({ oficio, onEdit }) => {
    return (
        <Card
            sx={{
                mb: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                }
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">
                                Número
                            </Typography>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                {String(oficio.numero).padStart(2, '0')}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">
                                Ano
                            </Typography>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                {oficio.ano}
                            </Typography>
                        </Grid>
                    </Grid>
                    <IconButton
                        color="primary"
                        onClick={() => onEdit(oficio.id)}
                        size="small"
                        sx={{
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.15)',
                            }
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Remetente:</strong> {oficio.remetente}
                </Typography>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Destinatário:</strong> {oficio.destinatario}
                </Typography>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Cidade:</strong> {oficio.cidade}
                </Typography>

                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    <strong>Descrição:</strong> {oficio.descricao}
                </Typography>

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
            </CardContent>
        </Card>
    );
};

export default OficioCard; 