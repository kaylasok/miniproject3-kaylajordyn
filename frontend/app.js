const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Helper function to add messages to the chat window
function addMessage(message, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', sender === 'user' ? 'user-message' : 'ai-message');
    msgDiv.textContent = `${sender}: ${message}`;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the latest message
}

// Function to fetch response from the Node.js backend
async function fetchResponse(prompt) {
    try {
        const response = await fetch('http://localhost:5000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error fetching response:', error);
        return 'Sorry, there was an error generating a response.';
    }
}

// Event listener for the "Send" button
sendBtn.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Display user's message
    addMessage(userMessage, 'You');
    userInput.value = '';

    // Fetch AI response from the backend
    const aiResponse = await fetchResponse(userMessage);
    addMessage(aiResponse, 'AI');
});
