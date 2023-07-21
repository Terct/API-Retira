const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');


async function saveData(awb, data, entregador, recebedor, documento, obs, capture1, capture2, codigoReferencia, base) {

  const dbPath = path.join('DataBase', base,'Data.db');
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
  });
  

  try {
    await Dados.sync(); // Cria a tabela se ainda não existir

    await Dados.create({
      AWB: awb,
      Data: data,
      Entregador: entregador,
      Recebedor: recebedor,
      Documento: documento,
      Obs: obs,
      Capture1: capture1,
      Capture2: capture2,
      CodigoReferencia: codigoReferencia,
    });

    console.log('Dados salvos com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
  }
}

module.exports = {
  saveData,
};




 //Exemplo de uso
//const awb = '123456784343434910';
//const data = '2023-07-12';
//const entregador = 'Johnddddddddddd4444dffd444443434343444444444ddddddddd';
//const recebedor = 'Janedddddddddddddd4444444fdfsfdfdfdf444444444dddddd';
//const doc = "32323"
//const obs = 'Alguma observação';
//const capture1 = true;
//const capture2 = false;
//const codigoReferencia = 'REddddddddd43434dfdffd3434343434dddddddddddddF3';
//const base = "IMP"


//saveData(awb, data, entregador, recebedor, doc, obs, capture1, capture2, codigoReferencia, base);