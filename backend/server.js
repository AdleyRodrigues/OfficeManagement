import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3001; // Adicionando PORT corretamente

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

app.use(cors());
app.use(express.json());

console.log('Servidor iniciando...'); // Log inicial do servidor

app.get('/', (req, res) => {
  res.send('Servidor rodando! Use /api/oficios para acessar os dados.');
});

// Endpoint de teste para verificar se o servidor está rodando
app.get('/api/test', (req, res) => {
  res.send('API está funcionando!');
});

// Endpoint para listar todos os ofícios
app.get('/api/oficios', async (req, res) => {
  console.log('Rota GET /api/oficios foi chamada'); // Log de debug
  try {
    const { rows } = await pool.query('SELECT * FROM oficios ORDER BY numero ASC');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Erro ao buscar os ofícios:', err);
    res.status(500).send('Erro ao buscar os ofícios.');
  }
});

// Endpoint para adicionar um novo ofício
app.post('/api/oficios', async (req, res) => {
  const { ano, remetente, destinatario, cidade, descricao, utilizado } = req.body;

  console.log('Dados recebidos no POST:', req.body);

  if (!ano || !remetente || !destinatario || !cidade) {
    return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos.');
  }

  try {
    const { rows } = await pool.query('SELECT numero FROM oficios ORDER BY numero DESC LIMIT 1');
    const ultimoNumero = rows.length > 0 ? rows[0].numero : 0;
    const novoNumero = ultimoNumero + 1;

    await pool.query(
      'INSERT INTO oficios (numero, ano, remetente, destinatario, cidade, descricao, utilizado) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [novoNumero, ano, remetente, destinatario, cidade, descricao, utilizado]
    );

    res.status(201).send('Ofício adicionado com sucesso!');
  } catch (err) {
    console.error('Erro ao adicionar o ofício:', err);
    res.status(500).send('Erro ao adicionar o ofício.');
  }
});

// Endpoint para editar um ofício
app.put('/api/oficios/:id', async (req, res) => {
  const { id } = req.params;
  const { ano, remetente, destinatario, cidade, descricao, utilizado } = req.body;

  console.log('Dados recebidos no PUT:', req.body);

  try {
    const { rowCount } = await pool.query(
      'UPDATE oficios SET ano = $1, remetente = $2, destinatario = $3, cidade = $4, descricao = $5, utilizado = $6 WHERE id = $7',
      [ano, remetente, destinatario, cidade, descricao, utilizado, id]
    );

    if (rowCount === 0) {
      return res.status(404).send('Ofício não encontrado.');
    }

    res.send('Ofício atualizado com sucesso!');
  } catch (err) {
    console.error('Erro ao atualizar o ofício:', err);
    res.status(500).send('Erro ao atualizar o ofício.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
