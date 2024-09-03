import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors'; // Importa o middleware CORS
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3001;

// Habilita o CORS para todas as rotas
app.use(cors());

app.use(express.json());

// Obtenha o caminho do diretório atual usando o método de módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para o arquivo JSON
const filePath = path.join(__dirname, 'src', 'data', 'oficios.json');

// Endpoint para adicionar um novo ofício
app.post('/api/oficios', (req, res) => {
    const { ano, nome } = req.body;

    if (!ano || !nome) {
        return res.status(400).send('Ano e nome são obrigatórios.');
    }

    // Ler o arquivo JSON
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao ler o arquivo.');
        }

        // Parseia os dados JSON existentes
        const oficiosPorAno = JSON.parse(data);

        // Gera um novo ID
        const newId = Date.now(); // Usar timestamp como ID único

        // Novo ofício a ser adicionado
        const novoOficio = { id: newId, nome };

        // Adiciona o novo ofício ao ano correspondente
        if (oficiosPorAno[ano]) {
            oficiosPorAno[ano].push(novoOficio);
        } else {
            oficiosPorAno[ano] = [novoOficio];
        }

        // Salva os dados atualizados de volta ao arquivo JSON
        fs.writeFile(filePath, JSON.stringify(oficiosPorAno, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao escrever no arquivo.');
            }
            res.status(200).send('Ofício adicionado com sucesso!');
        });
    });
});

// Endpoint para excluir um ofício
app.delete('/api/oficios/:ano/:id', (req, res) => {
    const { ano, id } = req.params;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao ler o arquivo.');
        }

        const oficiosPorAno = JSON.parse(data);
        if (!oficiosPorAno[ano]) {
            return res.status(404).send('Ano não encontrado.');
        }

        // Filtra para remover o ofício com o ID fornecido
        oficiosPorAno[ano] = oficiosPorAno[ano].filter((oficio) => oficio.id !== parseInt(id));

        fs.writeFile(filePath, JSON.stringify(oficiosPorAno, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao escrever no arquivo.');
            }
            res.status(200).send('Ofício excluído com sucesso!');
        });
    });
});

// Endpoint para editar um ofício
app.put('/api/oficios/:ano/:id', (req, res) => {
    const { ano, id } = req.params;
    const { nome } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao ler o arquivo.');
        }

        const oficiosPorAno = JSON.parse(data);
        if (!oficiosPorAno[ano]) {
            return res.status(404).send('Ano não encontrado.');
        }

        const oficioIndex = oficiosPorAno[ano].findIndex((oficio) => oficio.id === parseInt(id));
        if (oficioIndex === -1) {
            return res.status(404).send('Ofício não encontrado.');
        }

        oficiosPorAno[ano][oficioIndex].nome = nome;

        fs.writeFile(filePath, JSON.stringify(oficiosPorAno, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao escrever no arquivo.');
            }
            res.status(200).send('Ofício editado com sucesso!');
        });
    });
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
