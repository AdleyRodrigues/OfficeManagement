import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3001;

// Verificar se as variáveis de ambiente estão definidas
console.log('Configurações do banco de dados:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

// Configuração do pool de conexão com o banco de dados
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10, // Número máximo de conexões no pool
  idleTimeoutMillis: 30000, // Tempo de inatividade antes de fechar conexão (30s)
  connectionTimeoutMillis: 2000, // Tempo limite para conectar (2s)
  maxUses: 7500, // Máximo de consultas por conexão antes de reciclar
});

// Verificar conexão com o banco de dados
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados PostgreSQL');
    createIndexes(); // Criar índices ao iniciar o servidor
    release(); // Libera a conexão de volta para o pool
  }
});

// Sistema de cache simples
const cache = {
  data: {},
  set: function (key, value, ttl = 300000) { // TTL padrão: 5 minutos
    const now = Date.now();
    this.data[key] = {
      value,
      expiry: now + ttl
    };
  },
  get: function (key) {
    const now = Date.now();
    const entry = this.data[key];

    if (!entry) return null;

    if (now > entry.expiry) {
      delete this.data[key];
      return null;
    }

    return entry.value;
  },
  invalidatePrefix: function (prefix) {
    Object.keys(this.data).forEach(key => {
      if (key.startsWith(prefix)) {
        delete this.data[key];
      }
    });
  }
};

// Middleware para compressão de resposta
app.use(compression({
  level: 6, // Nível de compressão (0-9, 6 é o padrão)
  threshold: 1024 // Comprimir apenas respostas maiores que 1KB
}));

// Middleware para logging em ambiente de desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Middleware para CORS
app.use(cors());

// Middleware para parse de JSON
app.use(express.json());

console.log('Servidor iniciando...');

app.get('/', (req, res) => {
  res.send('Servidor rodando! Use /api/oficios para acessar os dados.');
});

// Endpoint de teste para verificar se o servidor está rodando
app.get('/api/test', (req, res) => {
  res.send('API está funcionando!');
});

// Função para criar índices no banco de dados
async function createIndexes() {
  try {
    const client = await pool.connect();

    try {
      // Verifica se o índice já existe antes de criar
      const indexCheck = await client.query(
        "SELECT indexname FROM pg_indexes WHERE tablename = 'oficios' AND indexname = 'idx_oficios_numero'"
      );

      if (indexCheck.rows.length === 0) {
        // Criar índice para numero
        await client.query('CREATE INDEX idx_oficios_numero ON oficios(numero)');
        console.log('Índice criado para a coluna numero');

        // Criar índice para ano
        await client.query('CREATE INDEX idx_oficios_ano ON oficios(ano)');
        console.log('Índice criado para a coluna ano');

        // Criar índice para utilizado
        await client.query('CREATE INDEX idx_oficios_utilizado ON oficios(utilizado)');
        console.log('Índice criado para a coluna utilizado');

        // Criar índice para remetente e destinatario (útil para buscas de texto)
        await client.query('CREATE INDEX idx_oficios_remetente ON oficios(remetente)');
        await client.query('CREATE INDEX idx_oficios_destinatario ON oficios(destinatario)');
        console.log('Índices criados para as colunas remetente e destinatario');
      } else {
        console.log('Índices já existem, pulando criação');
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Erro ao criar índices:', err);
  }
}

// Endpoint para listar todos os ofícios com paginação e cache
app.get('/api/oficios', async (req, res) => {
  const { page = 1, limit = 10, ano, utilizado, busca } = req.query;

  // Calcular offset para paginação
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // Construir a chave de cache baseada nos parâmetros da requisição
  const cacheKey = `oficios_${page}_${limit}_${ano || ''}_${utilizado || ''}_${busca || ''}`;

  // Verificar se há dados em cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Usando cache para: ${cacheKey}`);
    return res.json(cachedData);
  }

  try {
    // Preparar os parâmetros para a consulta
    const params = [];
    let paramCounter = 1;

    // Construir a consulta SQL base
    let queryCount = 'SELECT COUNT(*) FROM oficios';
    let query = 'SELECT id, numero, ano, remetente, destinatario, cidade, utilizado, descricao FROM oficios';

    // Array para armazenar cláusulas WHERE
    const whereConditions = [];

    // Adicionar condições de filtro se fornecidas
    if (ano) {
      whereConditions.push(`ano = $${paramCounter}`);
      params.push(ano);
      paramCounter++;
    }

    if (utilizado !== undefined) {
      whereConditions.push(`utilizado = $${paramCounter}`);
      params.push(utilizado === 'true');
      paramCounter++;
    }

    if (busca) {
      whereConditions.push(`(
        numero ILIKE $${paramCounter} OR 
        remetente ILIKE $${paramCounter} OR 
        destinatario ILIKE $${paramCounter} OR 
        cidade ILIKE $${paramCounter} OR 
        CAST(descricao AS TEXT) ILIKE $${paramCounter}
      )`);
      params.push(`%${busca}%`);
      paramCounter++;
    }

    // Adicionar cláusula WHERE se houver condições
    if (whereConditions.length > 0) {
      const whereClause = ' WHERE ' + whereConditions.join(' AND ');
      query += whereClause;
      queryCount += whereClause;
    }

    // Adicionar ordenação
    query += ' ORDER BY ano DESC, numero DESC';

    // Adicionar limites para paginação
    query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    params.push(parseInt(limit), offset);

    // Obter uma conexão do pool
    const client = await pool.connect();

    try {
      // Executar consulta para contar total de registros
      const countResult = await client.query(queryCount, params.slice(0, paramCounter - 1));
      const total = parseInt(countResult.rows[0].count);

      // Executar consulta principal
      const result = await client.query(query, params);

      // Preparar resposta com dados e informação de paginação
      const response = {
        data: result.rows,
        pagination: {
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
          currentPage: parseInt(page),
          pageSize: parseInt(limit)
        }
      };

      // Armazenar em cache
      cache.set(cacheKey, response);

      res.json(response);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Erro ao consultar ofícios:', err);
    res.status(500).json({ error: 'Erro ao consultar ofícios', details: err.message });
  }
});

// Endpoint para adicionar um novo ofício
app.post('/api/oficios', async (req, res) => {
  const { numero, ano, remetente, destinatario, cidade, utilizado, descricao } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO oficios (numero, ano, remetente, destinatario, cidade, utilizado, descricao) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [numero, ano, remetente, destinatario, cidade, utilizado, descricao]
    );

    // Invalidar cache após modificação
    cache.invalidatePrefix('oficios_');

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao inserir ofício:', err);
    res.status(500).json({ error: 'Erro ao inserir ofício', details: err.message });
  }
});

// Endpoint para editar um ofício
app.put('/api/oficios/:id', async (req, res) => {
  const id = req.params.id;
  const { numero, ano, remetente, destinatario, cidade, utilizado, descricao } = req.body;

  try {
    const result = await pool.query(
      'UPDATE oficios SET numero = $1, ano = $2, remetente = $3, destinatario = $4, cidade = $5, utilizado = $6, descricao = $7 WHERE id = $8 RETURNING *',
      [numero, ano, remetente, destinatario, cidade, utilizado, descricao, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ofício não encontrado' });
    }

    // Invalidar cache após modificação
    cache.invalidatePrefix('oficios_');

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar ofício:', err);
    res.status(500).json({ error: 'Erro ao atualizar ofício', details: err.message });
  }
});

// Endpoint para excluir um ofício
app.delete('/api/oficios/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query('DELETE FROM oficios WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ofício não encontrado' });
    }

    // Invalidar cache após modificação
    cache.invalidatePrefix('oficios_');

    res.json({ message: 'Ofício removido com sucesso' });
  } catch (err) {
    console.error('Erro ao remover ofício:', err);
    res.status(500).json({ error: 'Erro ao remover ofício', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
