const fs = require('fs');
const path = require('path');



function apagarImagem(token) {
  const fs = require('fs');
  const caminhoImagem = './Temp/'
  
  fs.readdir(caminhoImagem, (err, arquivos) => {
    if (err) {
      console.error(`Erro ao ler o diretório: ${err}`);
      return;
    }

    arquivos.forEach((arquivo) => {
      if (arquivo !== token + '-1.png' && arquivo !== token + '-2.png') {
        const caminhoArquivo = caminhoImagem + '/' + arquivo;
        fs.unlink(caminhoArquivo, (err) => {
          if (err) {
            console.error(`Erro ao apagar o arquivo: ${err}`);
          } else {
            console.log(`Arquivo ${arquivo} apagado com sucesso!`);
          }
        });
      }
    });
  });
}


function apagarImagemSelected(token) {

  //console.log("Apagando2")

  const fs = require('fs');
  const caminhoImagem = './Temp/'
  
  fs.readdir(caminhoImagem, (err, arquivos) => {
    if (err) {
      console.error(`Erro ao ler o diretório: ${err}`);
      return;
    }

    arquivos.forEach((arquivo) => {
      if (arquivo == token + '-1.png' || arquivo == token + '-2.png') {
        const caminhoArquivo = caminhoImagem + '/' + arquivo;
        fs.unlink(caminhoArquivo, (err) => {
          if (err) {
            console.error(`Erro ao apagar o arquivo: ${err}`);
          } else {
            console.log(`Arquivo ${arquivo} apagado com sucesso!`);
          }
        });
      }
    });
  });
}



module.exports = {
    apagarImagem,
    apagarImagemSelected
  };
  