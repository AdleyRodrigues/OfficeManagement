import React, { useState } from 'react';
import { TextField, Button, MenuItem, Typography, Container, Box, FormControl, Select, InputLabel, FormControlLabel, Checkbox } from '@mui/material';
import axios from 'axios';
import "./AddOficio.css";

const AddOficio: React.FC = () => {
  const [ano, setAno] = useState<string>(new Date().getFullYear().toString());
  const [remetente, setRemetente] = useState<string>('');
  const [destinatario, setDestinatario] = useState<string>('');
  const [cidade, setCidade] = useState<string>('');
  const [utilizado, setUtilizado] = useState<boolean>(false);
  const [tags, setTags] = useState<string>(''); // Tags como string

  // Função para adicionar um novo ofício
  const handleAddOficio = async () => {
    if (!ano || !remetente || !destinatario || !cidade) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    try {
      // Requisição para adicionar o ofício no backend
      const response = await axios.post('http://localhost:3001/api/oficios', {
        ano,
        remetente,
        destinatario,
        cidade,
        utilizado,
        tags: tags.split(',').map((tag: string) => tag.trim()).filter(tag => tag !== ''), // Convertendo tags em array e removendo entradas vazias
      });

      if (response.status === 201) {
        alert('Ofício adicionado com sucesso!');
        // Resetando os campos
        setAno(new Date().getFullYear().toString());
        setRemetente('');
        setDestinatario('');
        setCidade('');
        setUtilizado(false);
        setTags('');
      }
    } catch (error) {
      console.error('Erro ao adicionar o ofício:', error);
      alert('Erro ao adicionar o ofício. Verifique os dados e tente novamente.');
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <Container className="container" maxWidth="sm">
      <Box my={4}>
        <Typography className="title" variant="h4" align="center" gutterBottom>
          Adicionar Ofício
        </Typography>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Ano</InputLabel>
          <Select
            labelId="select-ano-label"
            label="Ano"
            value={ano}
            onChange={(e) => setAno(e.target.value as string)}
          >
            {yearOptions.map((anoOption) => (
              <MenuItem key={anoOption} value={anoOption}>
                {anoOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Remetente"
          value={remetente}
          onChange={(e) => setRemetente(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Destinatário"
          value={destinatario}
          onChange={(e) => setDestinatario(e.target.value)}
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Cidade</InputLabel>
          <Select
            value={cidade}
            onChange={(e) => setCidade(e.target.value as string)}
          >
            <MenuItem value="Crateús">Crateús</MenuItem>
            <MenuItem value="Nova Russas">Nova Russas</MenuItem>
            <MenuItem value="Ipueiras">Ipueiras</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Tags (separadas por vírgula)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={utilizado}
              onChange={(e) => setUtilizado(e.target.checked)}
            />
          }
          label="Utilizado"
          style={{ marginTop: '10px' }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddOficio}
          style={{ marginTop: '20px' }}
        >
          Adicionar Ofício
        </Button>
      </Box>
    </Container>
  );
};

export default AddOficio;
