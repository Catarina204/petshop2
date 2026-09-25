const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Arquivos da pasta public
app.use(express.static('public'));

// ===============================
// CONFIGURAÇÃO DO MYSQL
// ===============================

const db = mysql.createPool({
    host: 'localhost',
    user: 'admin',
    password: '1234',
    database: 'login',
    port: 3306,
});

// ===============================
// CONFIGURAÇÃO DO UPLOAD
// ===============================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },

    filename: function (req, file, cb) {

        const nomeArquivo =
            Date.now() +
            '-' +
            file.originalname.replace(/\s+/g, '-');

        cb(null, nomeArquivo);
    }
});

const upload = multer({
    storage: storage
});

// ===============================
// ROTA DE CADASTRO
// ===============================

app.post('/api/vest', upload.single('imagem'), async (req, res) => {

    try {

        const {
            tutor,
            email,
            senha,
            nomePet,
            raca,
            genero,
            peso,
            idade
        } = req.body;

        // Verifica campos
        if (
            !tutor ||
            !email ||
            !senha ||
            !nomePet ||
            !raca ||
            !genero ||
            !peso ||
            !idade
        ) {
            return res.status(400).json({
                message: 'Preencha todos os campos.'
            });
        }

        // Verifica imagem
        if (!req.file) {
            return res.status(400).json({
                message: 'Selecione uma imagem.'
            });
        }

        // Caminho da imagem
        const imagem = '/uploads/' + req.file.filename;

        // Verifica se o e-mail já existe
        const [usuarioExistente] = await db.query(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );

        if (usuarioExistente.length > 0) {
            return res.status(409).json({
                message: 'Este e-mail já está cadastrado.'
            });
        }

        // Insere no banco
        const [resultado] = await db.query(
            `INSERT INTO usuarios
            (tutor, email, senha, nomePet, raca, genero, peso, idade, imagem)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                tutor,
                email,
                senha,
                nomePet,
                raca,
                genero,
                peso,
                idade,
                imagem
            ]
        );

        console.log('Usuário cadastrado:', resultado.insertId);

        return res.status(201).json({
            message: 'Pet cadastrado com sucesso!'
        });

    } catch (error) {

        console.error('Erro no cadastro:', error);

        return res.status(500).json({
            message: 'Erro interno no servidor.'
        });
    }
});

// ===============================
// ROTA DE LOGIN
// ===============================

app.post('/api/login', async (req, res) => {

    const { email, senha } = req.body;

    try {

        const [rows] = await db.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {

            return res.status(401).json({
                message: 'E-mail ou senha incorretos.'
            });
        }

        const usuario = rows[0];

        if (usuario.senha !== senha) {

            return res.status(401).json({
                message: 'E-mail ou senha incorretos.'
            });
        }

        return res.status(200).json({

            message: 'Login realizado com sucesso!',

            usuario: {
                id: usuario.id,
                tutor: usuario.tutor,
                email: usuario.email,
                nomePet: usuario.nomePet,
                raca: usuario.raca,
                genero: usuario.genero,
                peso: usuario.peso,
                idade: usuario.idade,
                imagem: usuario.imagem
            }
        });

    } catch (error) {

        console.error('Erro no banco de dados:', error);

        return res.status(500).json({
            message: 'Erro interno no servidor.'
        });
    }
});

// ===============================
// INICIAR SERVIDOR
// ===============================

app.listen(3000, () => {

    console.log(
        'Servidor rodando em http://localhost:3000'
    );

});

process.on('uncaughtException', (err) => {

    console.error(
        '⚠️ O SERVIDOR CAIU PELO SEGUINTE ERRO:',
        err
    );

});
