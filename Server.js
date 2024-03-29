const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const http = require('http'); 
const { promisify } = require('util');
const { saveData } = require('./Save.js');
const { apagarImagem } = require('./Delete.js');
const { apagarImagemSelected } = require('./Delete.js');
const { renomearEMoverImagens } = require('./ArqImg.js');
const { ConsultarDados } = require('./Consulta.js');
const { BaixarImagem } = require('./View.js');
const { capture } = require('node-webcam');
const { BaixarAWB } = require('./Baixar.js')


const writeFileAsync = promisify(fs.writeFile);
// ... outros imports e código ...

// Caminho da pasta onde os certificados estão armazenados
const certFolderPath = '';

// Caminho da pasta onde as chaves estão armazenadas
const keyFolderPath = '';

// Lista os arquivos na pasta de certificados
const certFiles = fs.readdirSync(certFolderPath);

// Lista os arquivos na pasta de chaves
const keyFiles = fs.readdirSync(keyFolderPath);

// Função para verificar se um arquivo é um certificado
function isCertFile(file) {
  return file.startsWith('jajaexpress_com_br_ce') && file.endsWith('.crt');
}

// Função para verificar se um arquivo é uma chave
function isKeyFile(file) {
  return file.startsWith('ce') && file.endsWith('.key');
}

// Filtra os arquivos para identificar os certificados e chaves
const certFile = certFiles.find(isCertFile);
const keyFile = keyFiles.find(isKeyFile);

// Verifica se encontrou o certificado e a chave
if (!certFile || !keyFile) {
  console.error('Certificado ou chave não encontrados na pasta.');
  process.exit(1); // Encerra o processo, pois não há certificado ou chave disponível.
}

const options = {
  key: fs.readFileSync(path.join(keyFolderPath, keyFile)),
  cert: fs.readFileSync(path.join(certFolderPath, certFile))
};

// Restante do código do servidor...


const app = express();
const port = 3000; // Porta HTTPS padrão

// Define o tamanho máximo do corpo da solicitação como 50MB (pode ajustar conforme necessário)
app.use(express.json({ limit: '5000mb' }));
app.use(express.urlencoded({ limit: '5000mb', extended: true }));


app.use(express.static('public'));
app.use(express.json());


app.post('/capture', (req, res) => {
  const token = req.body.TokenAtual
  const base64Data = req.body.image.replace(/^data:image\/png;base64,/, '');

  // Define o nome do arquivo de captura como "capture.png"
  const filename = path.join(__dirname, 'Temp', token + '-1.png');

  // Salva a imagem na pasta local temporária
  writeFileAsync(filename, base64Data, 'base64')
    .then(() => {
      console.log(`Captura da webcam salva como ${filename}`);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Erro ao salvar a captura da webcam:', error);
      res.sendStatus(500);
    });
});

app.post('/capture2', (req, res) => {
  const token = req.body.TokenAtual
  const base64Data = req.body.image.replace(/^data:image\/png;base64,/, '');

  // Define o nome do arquivo de captura como "capture.png"
  const filename = path.join(__dirname, 'Temp', token + '-2.png');

  // Salva a imagem na pasta local temporária
  writeFileAsync(filename, base64Data, 'base64')
    .then(() => {
      console.log(`Captura da webcam salva como ${filename}`);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Erro ao salvar a captura da webcam:', error);
      res.sendStatus(500);
    });
});

app.post('/save', (req, res) => {
  // Extrair os dados da solicitação
  const awb = req.body.awb;
  const data = req.body.data;
  const entregador = req.body.entregador;
  const recebedor = req.body.recebedor;
  const documento = req.body.documento;
  const obs = req.body.obs;
  const capture1 = req.body.captureImagem1;
  const capture2 = req.body.captureImagem2;
  const codigoReferencia = req.body.codigoReferencia;
  const base = req.body.baseParam;

  // Chamar a função saveData para salvar os dados no banco de dados
  saveData(awb, data, entregador, recebedor, documento, obs, capture1, capture2, codigoReferencia, base)
    .then(() => {
      console.log('Dados salvos com sucesso!');
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Erro ao salvar os dados:', error);
      res.sendStatus(500);
    });
});

app.post('/del', (req, res) => {
  const token = req.body.token
  apagarImagem(token)
});

app.post('/delSelect', (req, res) => {
  const token = req.body.token
  apagarImagemSelected(token)
});

app.post('/arq', (req, res) => {
  const codeimg = req.body.codeimg;
  const token = req.body.token
  //console.log(token)
  renomearEMoverImagens(codeimg, token)
});

app.get('/consulta', (req, res) => {
  res.sendFile(__dirname + '/public/consulta.html');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/Index.html');
});


app.post('/consulta', (req, res) => {
  const criterio = req.body.criterio;
  const valor = req.body.valor;
  const base = req.body.baseParam;

  if (criterio && valor) {
    ConsultarDados(criterio, valor, base)
      .then(data => {
        res.json(data);
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Erro ao consultar dados.');
      });
  } else {
    res.status(400).send('Parâmetros inválidos.');
  }
});


app.post('/View', (req, res) => {
  const CodRef = req.body.CodRef;
  const CapType = req.body.CapType;
  const UserName = req.body.UserName;
  let CodFinal = ""

  if (CapType == 'Capture1') {
    CodFinal = '-1.png'
  } else {
    CodFinal = '-2.png'
  }

  const ImgName = CodRef + CodFinal

  BaixarImagem(ImgName, CapType, UserName)
    .then((retorno) => {
      // Aqui você pode acessar e manipular o valor retornado
      console.log(retorno);
      res.json({ directory: retorno }); // Enviar o diretório de destino como um objeto JSON
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500); // Ou outro código de status de erro adequado
    });
});



app.post('/login', (req, res) => {
  const base = req.body.base;
  const senha = req.body.senha;

  // Ler o arquivo JSON que contém as credenciais de login
  const loginData = fs.readJSONSync(path.join(__dirname, 'Login.json'));

  // Verificar se as credenciais de login são válidas
  const validCredentials = loginData.some(credentials => credentials.base === base && credentials.senha === senha);

  if (validCredentials) {
    res.sendStatus(200); // Credenciais válidas, retorna status 200
  } else {
    res.sendStatus(401); // Credenciais inválidas, retorna status 401
  }
});


app.get('/geral', (req, res) => {
  res.sendFile(__dirname + '/public/Config.html');
});

app.get('/config', (req, res) => {
  const baseParam = req.query.base;

  // Constrói o caminho completo para o arquivo Users.json
  const filePath = path.join(__dirname, 'DataBase', baseParam, 'Users.json');

  // Lê o conteúdo do arquivo Users.json
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      res.status(500).send('Erro ao ler o arquivo');
    } else {
      try {
        const users = JSON.parse(data);
        res.json(users);
      } catch (error) {
        console.error('Erro ao analisar o JSON:', error);
        res.status(500).send('Erro ao analisar o JSON');
      }
    }
  });
});

app.post('/users', (req, res) => {
  const baseParam = req.query.base;
  const filePath = path.join(__dirname, 'DataBase', baseParam, 'Users.json');
  const newUser = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      res.status(500).send('Erro ao ler o arquivo');
    } else {
      try {
        const users = JSON.parse(data);

        // Verifica se o código do novo usuário já está em uso
        const isCodeUsed = users.some(user => user.codigo === newUser.codigo);
        if (isCodeUsed) {
          res.status(400).send('O código do usuário já está em uso');
          return;
        }

        // Adiciona o novo usuário à lista
        users.push(newUser);

        // Salva os dados atualizados no arquivo Users.json
        fs.writeFile(filePath, JSON.stringify(users), 'utf8', (err) => {
          if (err) {
            console.error('Erro ao escrever no arquivo:', err);
            res.status(500).send('Erro ao escrever no arquivo');
          } else {
            res.sendStatus(200);
          }
        });
      } catch (error) {
        console.error('Erro ao analisar o JSON:', error);
        res.status(500).send('Erro ao analisar o JSON');
      }
    }
  });
});



app.post('/baixarawb', (req, res) => {

  console.log("BAIXANDO...")

  const CodRef = req.body.CodRef;
  const base = req.body.base;

  BaixarAWB(base, CodRef)
    .then((retorno) => {
      // Aqui você pode acessar e manipular o valor retornado
      console.log(retorno);
      res.json({ directory: retorno }); // Enviar o diretório de destino como um objeto JSON
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500); // Ou outro código de status de erro adequado
    });
});




///Limpar dados

const directoryPath = './public/Users';

fs.readdir(directoryPath, async (err, files) => {
  if (err) {
    console.error('Erro ao ler o diretório:', err);
    return;
  }

  for (const file of files) {
    const filePath = path.join(directoryPath, file);

    try {
      const stats = await fs.lstat(filePath);
      if (stats.isDirectory()) {
        await fs.rmdirSync(filePath, { recursive: true }); // Use fs.rmdirSync() com a opção recursive: true
        console.log(`Pasta ${filePath} removida com sucesso!`);
      }
    } catch (err) {
      console.error(`Erro ao remover a pasta ${filePath}:`, err);
    }
  }
});

// Verifique se a porta desejada é a porta 443
if (port === 443) {
  // Se sim, inicie o servidor HTTPS
  https.createServer(options, app).listen(port, () => {
    console.log(`Servidor HTTPS em execução na porta ${port}!`);
  });
} else {
  // Se não, inicie o servidor HTTP
  http.createServer(app).listen(port, () => {
    console.log(`Servidor HTTP em execução na porta ${port}!`);
  });
}

const hostname = 'jajaexpress.com.br'; // ou o endereço IP do seu servidor local
const port2 = 80;

const server = http.createServer((req, res) => {
  // Redirecionar para a URL local com HTTPS
  const redirectTo = `https://${hostname}${req.url}`;
  console.log(`Redirecionando para: ${redirectTo}`);
  
  // Configurar o cabeçalho de redirecionamento
  res.writeHead(301, { Location: redirectTo });
  res.end();
});

server.listen(port2, () => {
  console.log(`Servidor rodando na porta ${port2}`);
});
