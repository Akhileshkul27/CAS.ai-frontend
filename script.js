const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');

function addMessage(text, sender) {
  const message = document.createElement('div');
  message.classList.add('message', sender);
  message.innerHTML = `
    <img src="${sender === 'you' ? 'user.png' : 'logo.png'}" alt="${sender}">
    <div class="text">${text}</div>
  `;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addTypingIndicator() {
  const typingIndicator = document.createElement('div');
  typingIndicator.classList.add('typing-indicator');
  typingIndicator.id = 'typing-indicator';
  typingIndicator.innerHTML = `
    <img src="logo.png" alt="AI">
    <div class="dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  chatBox.appendChild(typingIndicator);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function addResponseLineByLine(text, sender) {
  const lines = text.split('\n'); // Split response into lines
  const message = document.createElement('div');
  message.classList.add('message', sender);
  message.innerHTML = `
    <img src="logo.png" alt="${sender}">
    <div class="text"></div>
  `;
  chatBox.appendChild(message);

  const textContainer = message.querySelector('.text');
  let lineIndex = 0;

  const interval = setInterval(() => {
    if (lineIndex < lines.length) {
      const line = document.createElement('span');
      line.textContent = lines[lineIndex];
      line.classList.add('fade-in'); // Add fade-in effect
      textContainer.appendChild(line);
      textContainer.appendChild(document.createElement('br')); // Add line break
      chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
      lineIndex++;
    } else {
      clearInterval(interval); // Stop when all lines are displayed
    }
  }, 1000); // Delay in milliseconds per line
}


sendBtn.addEventListener('click', async () => {
  const userText = userInput.value.trim();
  if (userText === '') return;

  addMessage(userText, 'you');
  userInput.value = '';

  addTypingIndicator(); // Show typing indicator

  try {
    const response = await fetch('https://cas-ai.onrender.com/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: userText})
    });
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    removeTypingIndicator(); // Remove typing indicator once response is received
    addResponseLineByLine(data.answer, 'bot'); // Display response line by line
  } catch (error) {
    removeTypingIndicator(); // Ensure typing indicator is removed on error
    addMessage(`Error: ${error.message}`, 'bot');
  }
});
