const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Middlewares essenciais (Sempre primeiro!)
app.use(cors());
app.use(express.json()); // Ativa a leitura de JSON no corpo das requisições

// 2. Inicializa o Banco de Dados ANTES das rotas carregarem
require('./startup/db')(); 

// 3. Importa e registra as rotas de usuário
const usuarioRoutes = require('./src/routes/UsuarioRouter');
app.use('/api/usuario', usuarioRoutes);

// 4. Inicializa o restante do seu sistema de rotas principal
require('./startup/router')(app); 

// 5. Iniciando o Serviço API
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em: http://localhost:${PORT}/api-docs`));