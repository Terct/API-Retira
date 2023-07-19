const fs = require('fs');
const path = require('path');



function renomearEMoverImagens(novoNome, token) {
console.log("Arquivando...")

const caminhoOrigem = 'Temp';
const caminhoDestino = './DBRetira/Imgs/Capture1';
const caminhoDestino2 = './DBRetira/Imgs/Capture2';

const caminhoOriginalCapture1 = path.join(caminhoOrigem, token + '-1.png');
const caminhoOriginalCapture2 = path.join(caminhoOrigem, token + '-2.png');

//console.log(caminhoOriginalCapture1)
//console.log(token)

  // Verificar se a imagem "capture.png" está presente
  if (fs.existsSync(caminhoOriginalCapture1)) {
    const novaCaminhoCapture1 = path.join(caminhoDestino, novoNome + '-1.png');
    fs.renameSync(caminhoOriginalCapture1, novaCaminhoCapture1);
  }

  // Verificar se a imagem "capture2.png" está presente
  if (fs.existsSync(caminhoOriginalCapture2)) {
    const novaCaminhoCapture2 = path.join(caminhoDestino2, novoNome + '-2.png');
    fs.renameSync(caminhoOriginalCapture2, novaCaminhoCapture2);
  }
}


module.exports = {
    renomearEMoverImagens
  };
  