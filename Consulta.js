const ADODB = require('node-adodb');
const path = require('path');

function ConsultarDados(criterio, valor, base) {
  return new Promise((resolve, reject) => {
    const dbPath = path.join('DataBase', base, 'Data.mdb');
    const connectionString = `Provider=Microsoft.Jet.OLEDB.4.0;Data Source=${dbPath};`;
    const connection = ADODB.open(connectionString);

    let query = '';
  
    switch (criterio) {
      case 'codigo':
        query = `SELECT * FROM Dados WHERE AWB='${valor}';`;
        break;
      case 'data':
        query = `SELECT * FROM Dados WHERE Data='${valor}';`;
        break;
      case 'nome':
        query = `SELECT * FROM Dados WHERE Recebedor='${valor}';`;
        break;
      default:
        reject('Critério inválido.');
        return;
    }

    connection
      .query(query)
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

module.exports = {
  ConsultarDados
};


//let codigo = "nome"
//let awb = "Marcos Coelho"
//ConsultarDados(codigo, awb)