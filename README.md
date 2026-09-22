# petshop_SESI_3A

📋 Pré-requisitos
Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas na sua máquina:

Node.js (v16 ou superior)

Docker Desktop (com Docker Compose)

Git

Um cliente SQL de sua preferência (ex: DBeaver, MySQL Workbench ou extensão do VS Code)

🛠️ Passo a Passo de Construção
1. Front-end: Estrutura HTML (index.html)
Crie o arquivo index.html para a estrutura do formulário de login:

2. Estilização CSS (style.css)
Crie o arquivo style.css para aplicar o visual responsivo e moderno com gradiente:

3. Script do Front-end (script.js)
Crie o arquivo script.js para capturar a submissão do formulário e realizar a requisição HTTP POST para a API Node.js:

4. Back-end com Node.js (server.js)
📦 Inicialização do Projeto e Dependências
No terminal da pasta do projeto, execute os comandos para criar o package.json e instalar as dependências necessárias:

npm init -y
npm install express cors mysql2

📝 Código do Servidor (server.js)
Crie o arquivo server.js:

🐳 Configuração do Banco de Dados com Docker
Você pode subir o banco de dados MySQL de duas maneiras: utilizando a imagem padrão do Docker Hub ou criando uma Imagem Personalizada do MySQL.

Opção A: Utilizando docker-compose.yml (Imagem Padrão)
Crie o arquivo docker-compose.yml na raiz do projeto:

Opção B: Passo a Passo para Criar uma Imagem Customizada do MySQL 🚀
Para criar uma imagem do MySQL pré-configurada (que cria o banco de dados e as tabelas automaticamente na inicialização), siga os passos abaixo:

1️⃣ Crie o arquivo de inicialização SQL (init.sql)
Crie o arquivo init.sql no seu diretório:
create table usuarios (
	id Int auto_increment primary key,
	email varchar(100) not null unique,
	senha varchar(100) not null,
	criado_em timestamp default CURRENT_TIMESTAMP
);

insert into usuarios (email, senha) 
values 
	('admin@empresa.com', 'admin123'),
	('maria@teste.com', 'senha123'),
	('joao@teste.com', 'admin456');

SELECT * from usuarios;
