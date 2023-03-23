const express = require('express');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require("openai");
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(express.static('public'));


const corsOptions = {
  origin: process.env.URL,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const { message, conversationHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Por favor, envía un mensaje.' });
  }

  const prompt = conversationHistory.join('\n') + '\nKitty:';
  const initialInfo = 'Te llamas kitty, Y estas hablando con un humano, tu creador es Jhonatan y tu Vives en Valencia, España, ajusta tu fecha y hora a GMT+1 concretamente '+ getDate() +', intenta se amigable y seguir la conversación con los últimos mensajes, si en los primeros mensajes el nombre del humano es Usuario preguntar si quiere que le llames de otra forma y que puede añadir su nombre arriba.';

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: initialInfo + prompt,
      max_tokens: 250,
      n: 1,
      stop: null,
      temperature: 0.9,
    });

    const chatGPTResponse = response.data.choices[0].text.trim();
    saveLogs(prompt);
    res.json({ response: chatGPTResponse });
  } catch (error) {
    console.error('Error al procesar tu mensaje:', error);
    res.status(500).json({ error: 'Error al procesar tu mensaje.' });
  }
});

function getDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function saveLogs(data, isError = false) {
  const messageType = isError ? 'stderr' : 'stdout';
  const fileName = `${messageType}_${getDate()}.log`;
  const logsFolderPath = 'logs';
  if (!fs.existsSync(logsFolderPath)) {
    fs.mkdirSync(logsFolderPath);
  }
  const filePath = path.join(logsFolderPath, fileName);

  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.error('Error al guardar el archivo:', err);
    }
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));
