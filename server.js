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

/*
const corsOptions = {
  origin: 'https://your-domain.com', // Reemplaza esto con el dominio que deseas permitir
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
*/
app.use(cors());
app.use(bodyParser.json());

// Agregamos un array para almacenar la conversación
let conversationHistory = [];

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Por favor, envía un mensaje.' });
  }

  // Agregamos el mensaje del usuario al historial
  conversationHistory.push(`Usuario: ${message}`);

  // Preparamos el prompt incluyendo el historial de la conversación
  const prompt = conversationHistory.join('\n') + '\nKitty:';

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 250,
      n: 1,
      stop: null,
      temperature: 0.9,
    });

    const chatGPTResponse = response.data.choices[0].text.trim();

    // Agregamos la respuesta del chatbot al historial
    conversationHistory.push(`Kitty: ${chatGPTResponse}`);

    res.json({ response: chatGPTResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar tu mensaje.' });
  }
});

app.get('/history', (req, res) => {
	res.json({ history: conversationHistory });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));
