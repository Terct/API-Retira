const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Função para consultar dados na tabela "Dados"
async function BaixarAWB(base, CodRef) {

    console.log(base)
    console.log(CodRef)
    console.log('teste')

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

    const data = await Dados.findAll({ where: { CodigoReferencia: CodRef } });

    // Update the Status column to "Baixado" for the matching rows
    for (const item of data) {
      await item.update({ Status: 'Baixado' });
    }

    return data;
  } catch (error) {
    throw error;
  }
}

module.exports = {
    BaixarAWB,
};

// Resto do código permanece igual

// Example usage:
 //let base = "IMP";
 //let CodRef = "REddddddddd43434dfdffd3434343434dddddddddddddF3";

 //BaixarAWB(base, CodRef)
 //  .then(data => {
 //    console.log(data);
 //  })
 //  .catch(error => {
 //    console.error('Erro ao consultar os dados:', error);
 //  });
