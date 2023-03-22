const express = require('express');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require("openai");
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(express.static('public'));


const corsOptions = {
  origin: 'https://kitty.dev-ja.cyou/',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

//app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const { message, conversationHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Por favor, envía un mensaje.' });
  }

  // Preparamos el prompt incluyendo el historial de la conversación
  const prompt = conversationHistory.join('\n') + '\nKitty:';
  const initialInfo = 'Te llamas kitty, Y estas hablando con un humano, tu creador es Jhonatan y tu Vives en Valencia, España, ajusta tu fecha y hora a GMT+1 concretamente '+ new Date() +', intenta se amigable y seguir la conversación con los últimos mensajes.';

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

    res.json({ response: chatGPTResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar tu mensaje.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));
