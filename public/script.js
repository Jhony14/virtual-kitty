document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
	const voiceBtn = document.getElementById('voiceBtn');
	const recognition = new window.webkitSpeechRecognition();
	const synth = window.speechSynthesis;

	let Username = localStorage.getItem('Username') || "Usuario";
  let conversationHistory = [];
	
	displayHistory();

  chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const message = chatInput.value.trim();
    if (!message) return;

    const userMessage = `${Username}: ${message}`;
    addChatMessage({ text: userMessage, sender: 'user' });
    conversationHistory.push(userMessage);

		//const response = await fetch('https://kitty.dev-ja.cyou/chat', {
		const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory }),
    });

    if (response.ok) {
      const data = await response.json();
      const chatbotMessage = `Kitty: ${data.response}`;
      addChatMessage({ text: chatbotMessage, sender: 'chatbot' });
      conversationHistory.push(chatbotMessage);
    } else {
      const errorMessage = 'Error al obtener respuesta del chatbot.';
      addChatMessage({ text: errorMessage, sender: 'chatbot' });
      conversationHistory.push(errorMessage);
    }

		localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
    chatInput.value = '';
  });

  function addChatMessage({ text, sender }) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

	voiceBtn.addEventListener('click', () => {
		console.log('Voice activated');
		recognition.start();
	});
	
	recognition.onresult = event => {
		const transcript = event.results[0][0].transcript;
		console.log(transcript);
		chatInput.value = transcript;
	};

	recognition.onerror = event => {
		console.log(event.error);
		console.log(event);
		console.log('Error');
		console.error(event.error);
	};

	function speak(text) {
		const utterance = new SpeechSynthesisUtterance(text);
		synth.speak(utterance);
	}

	recognition.onend = () => {
		console.log('Recognition ended');
	};

	function displayHistory() {
		const history = JSON.parse(localStorage.getItem('conversationHistory'));
		if (history) {
			history.forEach((message) => {
				addChatMessage({ text: message, sender: 'history' });
			});
			conversationHistory = history;
		}
	}

	document.querySelector('.clear-button').addEventListener('click', function() {
		localStorage.removeItem('conversationHistory');
		const chatMessages = document.querySelector('#chatMessages');
		conversationHistory = [];
		chatMessages.innerHTML = '';
	});

	document.querySelector('#nameInput').addEventListener('input', function() {
		Username = document.querySelector('#nameInput').value;
		if (Username == "") Username = "Usuario";
		localStorage.setItem('Username', Username);
	});

});
