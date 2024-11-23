// Importa o cliente do MongoDB para conectar ao banco de dados
import { MongoClient } from 'mongodb';

// Função assíncrona para conectar ao banco de dados usando uma string de conexão
export default async function conectarAoBanco(stringConexao) {
    let mongoClient;

    try {
        // Inicializa o cliente do MongoDB com a string de conexão fornecida
        mongoClient = new MongoClient(stringConexao);
        
        // Loga no console que está iniciando a conexão com o cluster do banco de dados
        console.log('Conectando ao cluster do banco de dados...');
        
        // Tenta estabelecer a conexão com o cluster
        await mongoClient.connect();
        
        // Loga no console que a conexão foi realizada com sucesso
        console.log('Conectado ao MongoDB Atlas com sucesso!');

        // Retorna o cliente conectado para ser usado em outras partes do código
        return mongoClient;
    } catch (erro) {
        // Caso ocorra um erro, loga a mensagem no console e o erro encontrado
        console.error('Falha na conexão com o banco!', erro);
        
        // Encerra o processo em caso de falha crítica na conexão
        process.exit();
    }
}
