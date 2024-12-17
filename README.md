
# **OfficeManagement**

  

**OfficeManagement** é uma aplicação web desenvolvida para o gerenciamento de ofícios, permitindo a criação, edição, listagem e exclusão de documentos de forma simples e eficiente. Ideal para pequenas organizações ou equipes que necessitam organizar documentos de maneira ágil e centralizada.

  

---

  

## 🚀 **Funcionalidades**

  

-  **Criar Ofícios:** Adicione novos ofícios especificando o ano, remetente, destinatário, cidade e descrição.

-  **Editar Ofícios:** Modifique os dados de ofícios já existentes.

-  **Excluir Ofícios:** Remova ofícios desnecessários.

-  **Listar Ofícios:** Visualize todos os ofícios cadastrados com filtros por ano e busca por palavras-chave.

-  **Navegação Intuitiva:** Interface moderna e responsiva com navegação facilitada.

  

---

  

## 🛠️ **Tecnologias Utilizadas**

  

### **Front-End:**

-  **Framework:** React com Vite

-  **Biblioteca UI:** Material-UI (MUI)

-  **Gerenciamento de Estado:** React Hooks

-  **Integração API:** Axios

  

### **Back-End:**

-  **Runtime:** Node.js

-  **Framework:** Express.js

-  **Banco de Dados:** PostgreSQL

-  **Hospedagem:** Render

  

---

  

## 🌐 **Hospedagem**

  

O projeto está hospedado nas seguintes plataformas:

  

-  **Front-End:** [Vercel](https://vercel.com)

  

-  **Back-End:** [Render](https://render.com)

  

---

  

## 📋 **Pré-requisitos**

  

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

  

-  **Node.js** (v14 ou superior) - [Instalar Node.js](https://nodejs.org)

-  **NPM** (v6 ou superior) ou **Yarn** (gerenciador de pacotes)

-  **Git** - [Instalar Git](https://git-scm.com)

  

---

  

## 🚀 **Como Rodar o Projeto Localmente**

  

### **1. Clone o Repositório**

```bash

git  clone  https://github.com/AdleyRodrigues/OfficeManagement.git

cd  OfficeManagement

```

  

### **2. Configurar Variáveis de Ambiente**

Crie um arquivo `.env` na pasta raiz do back-end e adicione as seguintes variáveis:

  

```bash

# Back-End .env

PGHOST=seu_host_do_postgres

PGUSER=seu_usuario_postgres

PGDATABASE=seu_banco_de_dados

PGPASSWORD=sua_senha_postgres

PGPORT=5432

  

# Front-End .env

VITE_API_URL=https://sua-api-render.com

```

  

### **3. Instale as Dependências**

#### **Back-End:**

```bash

cd  backend

npm  install

```

  

#### **Front-End:**

```bash

cd  frontend

npm  install

```

  

### **4. Execute o Projeto**

  

#### **Back-End:**

```bash

npm  run  dev

```

  

#### **Front-End:**

```bash

npm  run  dev

```

  
  

---

  

## 📁 **Estrutura do Projeto**

  

```plaintext

OfficeManagement/

├── backend/ # Código do servidor (Node.js/Express)

│ ├── controllers/ # Lógica das rotas

│ ├── routes/ # Definição de rotas

│ ├── models/ # Modelos do banco de dados

│ ├── config/ # Configurações do banco

│ └── server.js # Arquivo principal do servidor

│

├── frontend/ # Código do cliente (React)

│ ├── src/

│ │ ├── components/ # Componentes reutilizáveis

│ │ ├── features/ # Páginas e funcionalidades

│ │ ├── services/ # Configuração de API

│ │ └── App.tsx # Componente principal

│ └── public/ # Assets públicos

│

└── README.md # Documentação

```

  

---

  

## 🧪 **Testes**

  

- Para rodar testes (se configurados), utilize:

```bash

npm test

```

  

---

  

## 🤝 **Contribuição**

  

1. Faça um **fork** do projeto.

2. Crie uma **branch** com a sua funcionalidade: `git checkout -b minha-feature`.

3. Faça o **commit** das suas alterações: `git commit -m 'Adiciona minha nova feature'`.

4. Faça o **push** da sua branch: `git push origin minha-feature`.

5. Abra um **Pull Request**.

  

---

  

## 📄 **Licença**

  

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

  

---

  

## 🧑‍💻 **Desenvolvedor**

  

-  **Adley Rodrigues**

- GitHub: [@AdleyRodrigues](https://github.com/AdleyRodrigues)

  

