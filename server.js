import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const { Pool } = pkg;

const app = express();
const PORT = 3001;

const pool = new Pool({
  user: 'adley',
  host: 'localhost',
  database: 'oficios_db',
  password: '123456',
  port: 5432,
});

app.use(cors());
app.use(express.json());

// Endpoint para adicionar um novo ofício
app.post('/api/oficios', async (req, res) => {
  const { ano, remetente, destinatario, cidade, tags, utilizado } = req.body;

  console.log('Dados recebidos no POST:', req.body); // Log para depuração

  if (!ano || !remetente || !destinatario || !cidade) {
    return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos.');
  }

  try {
    // Busca o último número de ofício
    const { rows } = await pool.query('SELECT numero FROM oficios ORDER BY numero DESC LIMIT 1');
    const ultimoNumero = rows.length > 0 ? rows[0].numero : 0;
    const novoNumero = ultimoNumero + 1;

    // Insere o novo ofício no banco de dados com o número incrementado
    await pool.query(
      'INSERT INTO oficios (numero, ano, remetente, destinatario, cidade, tags, utilizado) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [novoNumero, ano, remetente, destinatario, cidade, tags, utilizado]
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
  const { ano, remetente, destinatario, cidade, tags, utilizado } = req.body;

  console.log('Dados recebidos no PUT:', req.body); // Log para depuração

  try {
    // Atualiza todos os campos necessários
    const { rowCount } = await pool.query(
      'UPDATE oficios SET ano = $1, remetente = $2, destinatario = $3, cidade = $4, tags = $5::text[], utilizado = $6 WHERE id = $7',
      [ano, remetente, destinatario, cidade, tags, utilizado, id]
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
