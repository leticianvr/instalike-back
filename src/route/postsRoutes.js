import express from "express"; // Importa o framework Express para lidar com requisições HTTP
import multer from "multer"; // Importa o módulo Multer para gerenciar uploads de arquivos
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";// Importa as funções do controlador de posts
import cors from "cors";

const corsOptions = {
origin:"http://localhost:8000", 
optionsSuccessStatus: 200
}


// Configura o armazenamento de arquivos com Multer
const storage = multer.diskStorage({
    // Define o diretório de destino para os uploads
    destination: function (req, file, cb) {
        cb(null, 'upload/'); // Diretório onde os arquivos serão salvos
    },
    // Define o nome do arquivo após o upload
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Mantém o nome original do arquivo
    }
});

// Cria uma instância do Multer com a configuração de destino e armazenamento
const upload = multer({ 
    dest: "./upload", // Diretório padrão para armazenamento
    storage // Configuração de armazenamento personalizada
});

// Configura as rotas da aplicação
const routes = (app) => {
    app.use(express.json());     // Permite que o Express parseie requisições com JSON no corpo
    app.use(cors(corsOptions))
    app.get('/posts', listarPosts);    // Define uma rota GET para listar todos os posts
    app.post("/posts", postarNovoPost);    // Define uma rota POST para criar um novo post
    app.post("/upload", upload.single("imagem"), uploadImagem);     // Define uma rota POST para fazer upload de uma imagem +     // Usa o middleware do Multer para processar o upload



    app.put("/upload/:id", atualizarNovoPost)
};


// Exporta as rotas para que possam ser usadas em outras partes do aplicativo
export default routes;
