const fs = require('fs');
const path = require('path');

function BaixarImagem(imageName, capture, computerName) {
  return new Promise((resolve, reject) => {
    const captureDirectory = `C:/Users/Micro/OneDrive/DBRetira/Imgs/${capture}`;
    const targetDirectory = path.join(__dirname, 'public', 'Users', computerName);

    // Verifica se a pasta existe
    if (!fs.existsSync(targetDirectory)) {
      // Cria a pasta se não existir
      fs.mkdirSync(targetDirectory, { recursive: true });
    }

    // Copia a imagem para a pasta de destino
    const sourcePath = path.join(captureDirectory, imageName);
    const targetPath = path.join(targetDirectory, imageName);

    fs.copyFile(sourcePath, targetPath, (err) => {
      if (err) {
        //console.error(`Erro ao copiar o arquivo ${imageName}:`, err);
        reject(err);
      } else {
        //console.log(`Arquivo ${imageName} copiado para ${targetDirectory}`);
        resolve(targetDirectory + '\\' + imageName);
      }
    });
  });
}

module.exports = {
  BaixarImagem
};
