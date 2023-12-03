const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');


const app = express();

app.use(bodyParser.json());

app.use(express.static("images"));

var path = require('path');
var public = path.join(__dirname, 'views');
app.use(express.static("images"));

// Middleware para upload de arquivos
const upload = multer({
  dest: './uploads',
});

app.get('/', (req, res) => {
	res.type('.html');   
	fs.readFile(path.join(public, 'index.html'), 'utf8', (err, text) => {
		console.log(err);
		res.send(text);
	});

});

// Rota para listar as imagens
app.get('/img', (req, res) => {
  res.send(images);
});



app.get("/images/:nome", (req, res) => {
	res.type('png') // => image/png:
  const nomeImagem = req.params.nome;

  // Obtém a imagem do diretório
  const imagem = fs.readFileSync(`images/${nomeImagem}`);

  // Retorna a imagem
  res.send(imagem);
});

// Rota para gerar a montagem
app.post('/montage', upload.single('image'), (req, res) => {
  // Obtenha as duas imagens selecionadas
  const image1 = images.find(image => image.id === req.body.image1);
  const image2 = images.find(image => image.id === req.body.image2);

  // Crie a montagem
  const montage = {
    width: 200,
    height: 200,
    left: {
      image: image1,
      width: 50,
      height: 50,
    },
    right: {
      image: image2,
      width: 50,
      height: 50,
    },
  };

  // Converta a montagem para uma imagem PNG
  const montageImage = new Image();
  montageImage.src = `data:image/png;base64,${JSON.stringify(montage)}`;
  const canvas = document.createElement('canvas');
  canvas.width = montageImage.width;
  canvas.height = montageImage.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(montageImage, 0, 0);
  const montagePng = canvas.toDataURL('image/png');

  // Responda com a imagem
  res.send({
    image: montagePng,
  });
});

// Rota para gerar a imagem de perfil do WhatsApp e Facebook
app.post('/profile-image', upload.single('image'), (req, res) => {
  // Obtenha a imagem selecionada
  const image = images.find(image => image.id === req.body.image);

  // Reduza o tamanho da imagem para 100x100 pixels
  const imageResized = new Image();
  imageResized.src = image.url;
  imageResized.width = 100;
  imageResized.height = 100;

  // Converta a imagem para uma imagem PNG
  const imagePng = imageResized.toDataURL('image/png');

  // Responda com a imagem
  res.send({
    image: imagePng,
  });
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});