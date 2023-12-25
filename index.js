const url = 'https://open-ai21.p.rapidapi.com/conversationmpt';
const chatLog = document.getElementById('chat-log'),
    userInput = document.getElementById('user-input'),
    sendButton = document.getElementById('send-button'),
    buttonIcon = document.getElementById('button-icon'),
    info = document.querySelector('.info');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') {
        return;
    } else if (message === 'developer') {
        userInput.value = '';
        appendMessage('user', message);
        setTimeout(async () => {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'X-RapidAPI-Key': '0641d84465mshbaf62fcb3988b12p1820bbjsn46f5b0a2abb4',
                        'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com'
                    },
                    body: JSON.stringify({
                        messages: [
                            {
                                role: 'user',
                                content: 'developer'
                            }
                        ],
                        web_access: false
                    })
                });

                const result = await response.json();
                
                if (result.result) {
                    appendMessage('bot', result.result);
                } else {
                    console.error('Invalid API response:', result);
                    appendMessage('bot', 'Error: Invalid API response');
                }

                buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
                buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
                info.style.display = 'none';
            } catch (error) {
                console.error(error);
                appendMessage('bot', 'Error: Check Your API Key!');
                buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
                buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
                info.style.display = 'red';
            }
        }, 2000);
        return;
    }

    appendMessage('user', message);
    userInput.value = '';

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '0641d84465mshbaf62fcb3988b12p1820bbjsn46f5b0a2abb4',
            'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
            web_access: false
        })
    };

    try {
        const response = await fetch('https://open-ai21.p.rapidapi.com/conversationgpt', options);
        const result = await response.json();
        
        if (result.result) {
            appendMessage('bot', result.result);
        } else {
            console.error('Invalid API response:', result);
            appendMessage('bot', 'Error: Invalid API response');
        }

        buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
        buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
        info.style.display = 'none';
    } catch (error) {
        console.error(error);
        if (error.name === 'TypeError') {
            appendMessage('bot', 'Error: Check Your API Key!');
            buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
            buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
            info.style.display = 'red';
        }
    }
}

function appendMessage(sender, message) {
    buttonIcon.classList.remove('fa-solid', 'fa-paper-plane');
    buttonIcon.classList.add('fas', 'fa-spinner', 'fa-pulse');

    const messageElement = document.createElement('div');
    const iconElement = document.createElement('div');
    const chatElement = document.createElement('div');
    const icon = document.createElement('i');

    chatElement.classList.add('chat-box');
    iconElement.classList.add('icon');
    messageElement.classList.add(sender);
    messageElement.innerText = message;

    if (sender === 'user') {
        icon.classList.add('fa-regular', 'fa-user');
        iconElement.setAttribute('id', 'user-icon');
    } else {
        icon.classList.add('fa-solid', 'fa-robot');
        iconElement.setAttribute('id', 'bot-icon');
    }

    iconElement.appendChild(icon);
    chatElement.appendChild(iconElement);
    chatElement.appendChild(messageElement);
    chatLog.appendChild(chatElement);
    chatLog.scrollTo = chatLog.scrollHeight;
}
