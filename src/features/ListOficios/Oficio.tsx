import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, IconButton, TextField, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit'; // Ícone de editar
import DeleteIcon from '@mui/icons-material/Delete'; // Ícone de excluir
import './Oficio.css'; // Importe o arquivo CSS
import oficiosPorAno from '../../data/oficios.json'; // Importe o arquivo JSON
import axios from 'axios'; // Para comunicação com a API

const Oficio: React.FC = () => {
  const [editingOficio, setEditingOficio] = useState<{ ano: string; id: number; nome: string } | null>(null);
  const [newName, setNewName] = useState('');

  // Função para excluir um ofício
  const handleDelete = async (ano: string, id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/oficios/${ano}/${id}`);
      alert('Ofício excluído com sucesso!');
      window.location.reload(); // Recarrega a página para atualizar a lista
    } catch (error) {
      console.error('Erro ao excluir o ofício:', error);
      alert('Erro ao excluir o ofício.');
    }
  };

  // Função para editar um ofício
  const handleEdit = (ano: string, id: number, nome: string) => {
    setEditingOficio({ ano, id, nome });
    setNewName(nome);
  };

  // Função para salvar o ofício editado
  const handleSaveEdit = async () => {
    if (editingOficio) {
      try {
        await axios.put(`http://localhost:3001/api/oficios/${editingOficio.ano}/${editingOficio.id}`, {
          nome: newName,
        });
        alert('Ofício editado com sucesso!');
        setEditingOficio(null);
        setNewName('');
        window.location.reload(); // Recarrega a página para atualizar a lista
      } catch (error) {
        console.error('Erro ao editar o ofício:', error);
        alert('Erro ao editar o ofício.');
      }
    }
  };

  return (
    <div className="container">
      <h1 className="title">Ofícios</h1>
      {Object.entries(oficiosPorAno).map(([year, documents]) => (
        <Accordion className="accordion-item" key={year}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${year}-content`}
            id={`panel-${year}-header`}
          >
            <Typography className="accordion-header">{year}</Typography>
          </AccordionSummary>
          <AccordionDetails className="accordion-content">
            {documents.length > 0 ? (
              <ul>
                {documents.map((doc) => (
                  <li key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {editingOficio && editingOficio.id === doc.id ? (
                      <Box display="flex" alignItems="center">
                        <TextField
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          size="small"
                        />
                        <Button variant="contained" color="primary" onClick={handleSaveEdit}>
                          Salvar
                        </Button>
                        <Button variant="outlined" onClick={() => setEditingOficio(null)}>
                          Cancelar
                        </Button>
                      </Box>
                    ) : (
                      <>
                        <Typography>{doc.nome}</Typography>
                        <div>
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(year, doc.id, doc.nome)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => handleDelete(year, doc.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>Nenhum ofício encontrado para este ano.</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default Oficio;
