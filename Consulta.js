const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');


// Função para consultar dados na tabela "Dados"
async function ConsultarDados(criterio, valor, base) {

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
  Documento: { type: DataTypes.STRING, allowNull: false },
  Obs: { type: DataTypes.STRING, allowNull: false },
  Capture1: { type: DataTypes.BOOLEAN, allowNull: false },
  Capture2: { type: DataTypes.BOOLEAN, allowNull: false },
  CodigoReferencia: { type: DataTypes.STRING, allowNull: false },
  Status: { type: DataTypes.STRING, allowNull: false },
});

  try {
    await sequelize.authenticate(); // Conecta ao banco de dados
    await Dados.sync(); // Cria a tabela se ainda não existir

    let data;
    switch (criterio) {
      case 'codigo':

        data = await Dados.findAll({ where: { AWB: valor } });

        break;
      case 'data':

        const parts = valor.split('-');
        const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
        data = await Dados.findAll({ where: { Data: formattedDate } });

        break;
      case 'nome':
        
        data = await Dados.findAll({ where: { Status: valor } });

        break;
      default:
        throw new Error('Critério inválido.');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  ConsultarDados,
};

// Resto do código permanece igual

//let codigo = "data"
//let awb = "19/07/2023";
//let base = "IMP"

//ConsultarDados(codigo, awb, base)
// .then(data => {
//    console.log(data);
//  })
//  .catch(error => {
//    console.error('Erro ao consultar os dados:', error);
//  })