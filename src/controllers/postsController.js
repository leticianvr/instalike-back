import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModels.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js"

// Função para listar todos os posts
export async function listarPosts(req, res) {
    // Obtém todos os posts do banco de dados
    const posts = await getTodosPosts();

    // Retorna a lista de posts em formato JSON com status 200 (sucesso)
    res.status(200).json(posts);
}

// Função para criar um novo post
export async function postarNovoPost(req, res) {
    // Obtém os dados do novo post a partir do corpo da requisição
    const novoPost = req.body;

    try {
        // Cria o post no banco de dados e armazena o resultado
        const postCriado = await criarPost(novoPost);

        // Retorna o post criado em formato JSON com status 200 (sucesso)
        res.status(200).json(postCriado);
    } catch (erro) {
        // Loga o erro no console, caso ocorra uma falha
        console.error(erro.message);

        // Retorna uma mensagem de erro com status 500 (falha no servidor)
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

// Função para realizar o upload de uma imagem e associá-la a um post
export async function uploadImagem(req, res) {
    // Cria um objeto para o novo post, com informações iniciais
    const novoPost = {
        descricao: "", // Descrição inicial vazia
        imgUrl: req.file.originalname, // Nome original do arquivo enviado
        alt: "" // Texto alternativo inicial vazio
    };

    try {
        // Cria o novo post no banco de dados e armazena o resultado
        const postCriado = await criarPost(novoPost);

        // Define o caminho atualizado para salvar a imagem renomeada
        const imagemAtualizada = `upload/${postCriado.insertedId}.png`;

        // Renomeia/move o arquivo de imagem para o novo caminho
        fs.renameSync(req.file.path, imagemAtualizada);

        // Retorna o post criado em formato JSON com status 200 (sucesso)
        res.status(200).json(postCriado);
    } catch (erro) {
        // Loga o erro no console, caso ocorra uma falha
        console.error(erro.message);

        // Retorna uma mensagem de erro com status 500 (falha no servidor)
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

export async function atualizarNovoPost(req, res) {
    console.log("Parâmetros recebidos:", req.params);
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ "Erro": "ID não fornecido na URL" });
    }

    const urlImagem = `http://localhost:3000/${id}.png`;

    try {
        const imgBuffer = fs.readFileSync(`upload/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imgBuffer)
        
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        };
        
        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}