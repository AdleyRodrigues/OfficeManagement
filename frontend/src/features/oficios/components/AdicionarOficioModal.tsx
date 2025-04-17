import AddIcon from '@mui/icons-material/Add';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Checkbox,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Snackbar,
    TextField
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useOficiosStore } from '../store/oficiosStore';
import { OficioItem } from '../types';

interface AdicionarOficioModalProps {
    open?: boolean;
    onClose?: () => void;
    onSuccess?: () => void;
}

const AdicionarOficioModal: React.FC<AdicionarOficioModalProps> = ({ open, onClose, onSuccess }) => {
    const [visible, setVisible] = useState(false);
    const { addOficio, loading } = useOficiosStore();
    const currentYear = new Date().getFullYear();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Estado do formulário
    const [formData, setFormData] = useState({
        ano: currentYear.toString(),
        remetente: '',
        destinatario: '',
        cidade: 'Crateús',
        descricao: '',
        utilizado: false
    });

    // Atualiza o estado interno quando a prop 'open' mudar
    useEffect(() => {
        if (open !== undefined) {
            setVisible(open);
        }
    }, [open]);

    const handleOpen = () => {
        setVisible(true);
    };

    const handleClose = () => {
        resetForm();
        setVisible(false);
        if (onClose) {
            onClose();
        }
    };

    const resetForm = () => {
        setFormData({
            ano: currentYear.toString(),
            remetente: '',
            destinatario: '',
            cidade: 'Crateús',
            descricao: '',
            utilizado: false
        });
        setError(null);
    };

    const handleChange = (field: string) => (
        event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
    ) => {
        const value = event.target.value;
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            utilizado: event.target.checked,
        });
    };

    const handleSubmit = async () => {
        try {
            // Validar campos obrigatórios
            if (!formData.ano || !formData.remetente || !formData.destinatario) {
                setError('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            const novoOficio: Omit<OficioItem, 'id' | 'numero'> = {
                ano: parseInt(formData.ano),
                remetente: formData.remetente,
                destinatario: formData.destinatario,
                cidade: formData.cidade,
                descricao: formData.descricao || '',
                utilizado: formData.utilizado
            };

            await addOficio(novoOficio);
            setSuccess(true);
            resetForm();

            // Fechar o modal após adicionar com sucesso
            setTimeout(() => {
                setVisible(false);
                if (onClose) {
                    onClose();
                }
                if (onSuccess) {
                    onSuccess();
                }
            }, 1500);
        } catch (error) {
            console.error('Erro ao adicionar ofício:', error);
            setError('Erro ao adicionar ofício. Tente novamente.');
        }
    };

    const handleSnackbarClose = () => {
        setSuccess(false);
    };

    // Lista de cidades
    const cidadesOptions = ['Crateús', 'Nova Russas', 'Ipueiras'];

    // Se o componente for usado com botão interno
    if (open === undefined) {
        return (
            <>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                >
                    Adicionar Ofício
                </Button>

                <Dialog
                    open={visible}
                    onClose={handleClose}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Adicionar Novo Ofício</DialogTitle>
                    <DialogContent>
                        {renderForm()}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={24} /> : null}
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={success}
                    autoHideDuration={4000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={handleSnackbarClose} severity="success">
                        Ofício adicionado com sucesso!
                    </Alert>
                </Snackbar>
            </>
        );
    }

    // Se o componente for controlado externamente
    return (
        <>
            <Dialog
                open={visible}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Adicionar Novo Ofício</DialogTitle>
                <DialogContent>
                    {renderForm()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={24} /> : null}
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={success}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success">
                    Ofício adicionado com sucesso!
                </Alert>
            </Snackbar>
        </>
    );

    // Função para renderizar o formulário (evita duplicação de código)
    function renderForm() {
        return (
            <Box sx={{ pt: 2 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Ano"
                            value={formData.ano}
                            disabled
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Remetente"
                            value={formData.remetente}
                            onChange={handleChange('remetente')}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Destinatário"
                            value={formData.destinatario}
                            onChange={handleChange('destinatario')}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth required>
                            <InputLabel id="cidade-label">Cidade</InputLabel>
                            <Select
                                labelId="cidade-label"
                                value={formData.cidade}
                                onChange={handleChange('cidade') as unknown as (event: SelectChangeEvent) => void}
                                label="Cidade"
                            >
                                {cidadesOptions.map((cidade) => (
                                    <MenuItem key={cidade} value={cidade}>
                                        {cidade}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Descrição"
                            value={formData.descricao}
                            onChange={handleChange('descricao')}
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.utilizado}
                                    onChange={handleCheckboxChange}
                                    color="primary"
                                />
                            }
                            label="Ofício Utilizado"
                        />
                    </Grid>
                </Grid>
            </Box>
        );
    }
};

export default AdicionarOficioModal; 