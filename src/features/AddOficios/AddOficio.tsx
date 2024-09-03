import React, { useState } from 'react';
import { TextField, Button, MenuItem, Typography, Container, Box } from '@mui/material';
import axios from 'axios'; // Adicione a importação do axios
import "./AddOficio.css";

// A página de adicionar ofício não precisa mais do JSON local, pois os dados agora são enviados para o backend
const AddOficio: React.FC = () => {
  const [nome, setNome] = useState('');
  const [ano, setAno] = useState('');

  const handleAddOficio = () => {
    if (nome && ano) {
      // Requisição para o servidor para adicionar o ofício
      axios
        .post('http://localhost:3001/api/oficios', { ano, nome })
        .then((response) => {
          alert(response.data); // Mensagem de sucesso do backend
          setNome(''); // Limpa o campo de nome
          setAno('');  // Limpa o campo de ano
        })
        .catch((error) => {
          console.error('Erro ao adicionar ofício:', error);
          alert('Erro ao adicionar ofício.');
        });
    } else {
      alert('Por favor, preencha todos os campos!');
    }
  };

  return (
    <Container className="container" maxWidth="sm">
      <Box my={4}>
        <Typography className="title" variant="h4" align="center" gutterBottom>
          Adicionar Ofício
        </Typography>
        <TextField
          fullWidth
          label="Nome do Ofício"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          margin="normal"
        />
        <TextField
          select
          fullWidth
          label="Ano"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
          margin="normal"
        >
          <MenuItem value="2023">2023</MenuItem>
          <MenuItem value="2024">2024</MenuItem>
          <MenuItem value="2025">2025</MenuItem>
        </TextField>
        <Button variant="contained" color="primary" fullWidth onClick={handleAddOficio}>
          Adicionar Ofício
        </Button>
      </Box>
    </Container>
  );
};

export default AddOficio;
