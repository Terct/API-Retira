const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Função para consultar todos os dados na tabela "Dados"
async function ConsultarTodosDados(base) {

  const dbPath = path.join('DataBase', base, 'Data.db'); // Atualize o caminho para o arquivo do banco de dados
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
  });

  const Dados = sequelize.define('Dados', {
    AWB: { type: DataTypes.STRING, allowNull: false },
    Data: { type: DataTypes.STRING, allowNull: false },
    Entregador: { type: DataTypes.STRING, allowNull: false },
    Recebedor: { type: DataTypes.STRING, allowNull: false },
    Obs: { type: DataTypes.STRING, allowNull: false },
    Capture1: { type: DataTypes.BOOLEAN, allowNull: false },
    Capture2: { type: DataTypes.BOOLEAN, allowNull: false },
    CodigoReferencia: { type: DataTypes.STRING, allowNull: false },
  });

  try {
    await sequelize.authenticate(); // Conecta ao banco de dados
    await Dados.sync(); // Cria a tabela se ainda não existir

    const todosOsDados = await Dados.findAll(); // Consulta todos os registros
    return todosOsDados;
  } catch (error) {
    throw error;
  }
}


(async () => {
    try {
        
    const base =  'IMP'
      const todosOsDados = await ConsultarTodosDados(base);
      todosOsDados.forEach((dado) => {
        console.log(dado.toJSON()); // Isso exibe cada registro como um objeto JavaScript
      });
    } catch (error) {
      console.error('Erro ao consultar dados:', error);
    }
  })();

module.exports = {
  ConsultarTodosDados,
};
