import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import './Oficio.css'; // Importação do estilo atualizado

interface Oficio {
  id: number;
  numero: string;
  ano: string | number;
  remetente: string;
  destinatario: string;
  cidade: string;
  utilizado: boolean;
  tags?: string[];
}

const Oficio: React.FC = () => {
  const [oficios, setOficios] = useState<Oficio[]>([]);
  const [filteredOficios, setFilteredOficios] = useState<Oficio[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<string>('');
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [selectedOficio, setSelectedOficio] = useState<Oficio | null>(null);

  const fetchOficios = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/oficios');
      const formattedOficios = response.data.map((oficio: Oficio) => ({
        ...oficio,
        // Garante que 'tags' seja tratada como string antes de usar 'split'
        tags: typeof oficio.tags === 'string'
          ? (oficio.tags as string).split(',').map((tag) => tag.trim())
          : oficio.tags,
      }));
      setOficios(formattedOficios);
      setFilteredOficios(formattedOficios);
    } catch (error) {
      console.error('Erro ao buscar os ofícios:', error);
      alert('Erro ao buscar os ofícios.');
    }
  };

  useEffect(() => {
    fetchOficios();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [yearFilter, searchTerm]);

  const applyFilters = () => {
    let filtered = oficios;
    if (yearFilter) {
      filtered = filtered.filter((oficio) => oficio.ano.toString().includes(yearFilter));
    }
    if (searchTerm) {
      filtered = filtered.filter((oficio) =>
        Object.values(oficio).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setFilteredOficios(filtered);
  };

  const handleEdit = (oficio: Oficio) => {
    setSelectedOficio(oficio);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedOficio(null);
  };

  const handleSaveEdit = async () => {
    if (selectedOficio) {
      const updatedOficio = {
        ...selectedOficio,
        ano: selectedOficio.ano,
        utilizado: selectedOficio.utilizado,
        tags: selectedOficio.tags?.map((tag: string) => tag.trim()).filter(tag => tag !== ''),
      };

      try {
        await axios.put(`http://localhost:3001/api/oficios/${selectedOficio.id}`, updatedOficio);
        alert('Ofício atualizado com sucesso!');
        fetchOficios();
        handleCloseEditDialog();
      } catch (error) {
        console.error('Erro ao atualizar o ofício:', error);
        alert('Erro ao atualizar o ofício.');
      }
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="container">
      <h1 className="title">Ofícios</h1>

      <div className="controls">
        <div className="filters">
          <TextField
            label="Pesquisa"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
          <FormControl style={{ minWidth: 120 }}>
            <InputLabel>Ano</InputLabel>
            <Select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value as string)}
            >
              <MenuItem value="">
                <em>Todos</em>
              </MenuItem>
              {Array.from(new Set(oficios.map((oficio) => oficio.ano.toString()))).map((ano) => (
                <MenuItem key={ano} value={ano}>
                  {ano}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={applyFilters}>
            Filtrar
          </Button>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          href="/add"
        >
          Adicionar Ofício
        </Button>
      </div>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número do Ofício</TableCell>
              <TableCell>Ano</TableCell>
              <TableCell>Remetente</TableCell>
              <TableCell>Destinatário</TableCell>
              <TableCell>Cidade</TableCell>
              <TableCell>Utilizado</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOficios.map((oficio) => (
              <TableRow key={oficio.id}>
                <TableCell>{oficio.numero}</TableCell>
                <TableCell>{oficio.ano}</TableCell>
                <TableCell>{oficio.remetente}</TableCell>
                <TableCell>{oficio.destinatario}</TableCell>
                <TableCell>{oficio.cidade}</TableCell>
                <TableCell>{oficio.utilizado ? 'Sim' : 'Não'}</TableCell>
                <TableCell>{Array.isArray(oficio.tags) ? oficio.tags.join(', ') : ''}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(oficio)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        aria-labelledby="edit-oficio-title"
      >
        <DialogTitle id="edit-oficio-title">Editar Ofício</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-ano-label">Ano</InputLabel>
            <Select
              labelId="select-ano-label"
              label="Ano"
              value={selectedOficio?.ano || ''}
              onChange={(e) =>
                setSelectedOficio({ ...selectedOficio, ano: e.target.value } as Oficio)
              }
            >
              {yearOptions.map((ano) => (
                <MenuItem key={ano} value={ano}>
                  {ano}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Remetente"
            value={selectedOficio?.remetente || ''}
            onChange={(e) =>
              setSelectedOficio({
                ...selectedOficio,
                remetente: e.target.value,
              } as Oficio)
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Destinatário"
            value={selectedOficio?.destinatario || ''}
            onChange={(e) =>
              setSelectedOficio({
                ...selectedOficio,
                destinatario: e.target.value,
              } as Oficio)
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Cidade"
            value={selectedOficio?.cidade || ''}
            onChange={(e) =>
              setSelectedOficio({
                ...selectedOficio,
                cidade: e.target.value,
              } as Oficio)
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tags"
            placeholder="Ex: Educação, Eventos"
            value={selectedOficio?.tags?.join(', ') || ''}
            onChange={(e) => {
              const tagsArray = e.target.value.split(',').map((tag: string) => tag.trim()).filter(tag => tag !== '');
              setSelectedOficio({
                ...selectedOficio,
                tags: tagsArray,
              } as Oficio);
            }}
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="select-utilizado-label" shrink>Utilizado</InputLabel>
            <Select
              labelId="select-utilizado-label"
              label="Utilizado"
              value={selectedOficio?.utilizado ? 'Sim' : 'Não'}
              onChange={(e) =>
                setSelectedOficio({
                  ...selectedOficio,
                  utilizado: e.target.value === 'Sim',
                } as Oficio)
              }
            >
              <MenuItem value="Sim">Sim</MenuItem>
              <MenuItem value="Não">Não</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Oficio;
