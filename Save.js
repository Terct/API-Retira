const ADODB = require('node-adodb');
const path = require('path');

function saveData(awb, data, entregador, recebedor, obs, capture1, capture2, codigoReferencia, base) {
  return new Promise((resolve, reject) => {
    const dbPath = path.join('DataBase', base, 'Data.mdb');
    const connectionString = `Provider=Microsoft.Jet.OLEDB.4.0;Data Source=${dbPath};`;
    const connection = ADODB.open(connectionString);

    const query = `INSERT INTO Dados (AWB, Data, Entregador, Recebedor, Obs, Capture1, Capture2, CodigoReferencia) VALUES ('${awb}', '${data}', '${entregador}', '${recebedor}', '${obs}', ${capture1 ? 1 : 0}, ${capture2 ? 1 : 0}, '${codigoReferencia}')`;
    connection
      .execute(query)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = {
  saveData
};



// Exemplo de uso
//const awb = '123456784343434910';
//const data = '2023-07-12';
//const entregador = 'Johnddddddddddd4444dffd444443434343444444444ddddddddd';
//const recebedor = 'Janedddddddddddddd4444444fdfsfdfdfdf444444444dddddd';
//const obs = 'Alguma observação';
//const capture1 = true;
//const capture2 = false;
//const codigoReferencia = 'REddddddddd43434dfdffd3434343434dddddddddddddF3';

//saveData(awb, data, entregador, recebedor, obs, capture1, capture2, codigoReferencia)
//  .then(() => {
//    console.log('Dados salvos com sucesso!');
//  })
//  .catch((error) => {
//    console.error('Erro ao salvar os dados:', error);
//  });
