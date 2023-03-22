document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

	getHistory();

  chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const message = chatInput.value.trim();
    if (!message) return;

    addChatMessage({ text: message, sender: 'user' });

    const response = await fetch('https://kitty.dev-ja.cyou/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (response.ok) {
      const data = await response.json();
      addChatMessage({ text: data.response, sender: 'chatbot' });
    } else {
      addChatMessage({ text: 'Error al obtener respuesta del chatbot.', sender: 'chatbot' });
    }

    chatInput.value = '';
  });

  function addChatMessage({ text, sender }) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

	function getHistory() {
		fetch('https://kitty.dev-ja.cyou/history')
			.then(response => response.json())
			.then(data => {
				data.history.forEach(message => {
					addChatMessage({ text: message, sender: 'history' });
				});
			});
	}
});

