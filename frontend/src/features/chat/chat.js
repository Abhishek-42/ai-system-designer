import { sendChatMessage, checkBackendHealth } from '../../shared/api/apiClient.js';
import { escapeHtml, formatMarkdown, getTimestamp, showToast } from '../../shared/utils/formatters.js';

let conversationHistory = [];
let isWaiting = false;

function setConnectionStatus(connectionStatus, label, color) {
    connectionStatus.textContent = label;
    connectionStatus.style.color = color;
}

export function setupChat() {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const typingIndicator = document.getElementById('typingIndicator');
    const clearChatBtn = document.getElementById('clearChatBtn');
    const connectionStatus = document.getElementById('connectionStatus');

    if (!chatMessages) {
        return;
    }

    function addMessage(content, role) {
        const div = document.createElement('div');
        div.className = 'message ' + (role === 'user' ? 'user-message' : 'ai-message') + ' animate-in';

        const avatarSvg = role === 'user'
            ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
            : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';

        const formatted = role === 'user' ? '<p>' + escapeHtml(content) + '</p>' : formatMarkdown(content);

        div.innerHTML = `
            <div class="message-avatar">${avatarSvg}</div>
            <div class="message-content">
                <div class="message-bubble">${formatted}</div>
                <span class="message-time">${getTimestamp()}</span>
            </div>
        `;

        chatMessages.appendChild(div);
        requestAnimationFrame(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }

    function showTyping() {
        typingIndicator.classList.add('visible');
    }

    function hideTyping() {
        typingIndicator.classList.remove('visible');
    }

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message || isWaiting) {
            return;
        }

        addMessage(message, 'user');
        conversationHistory.push({ role: 'user', content: message });

        chatInput.value = '';
        chatInput.style.height = 'auto';
        isWaiting = true;
        sendBtn.disabled = true;
        showTyping();

        try {
            const data = await sendChatMessage(message, conversationHistory.slice(0, -1));
            hideTyping();
            addMessage(data.response, 'model');
            conversationHistory.push({ role: 'model', content: data.response });
            setConnectionStatus(connectionStatus, 'Connected', '#10b981');
        } catch (error) {
            hideTyping();
            const errorMessage = error.message.includes('Failed to fetch')
                ? '**Cannot connect to the AI service.** Make sure FastAPI is running.'
                : '**Error:** ' + error.message;
            addMessage(errorMessage, 'model');
            setConnectionStatus(connectionStatus, 'Disconnected', '#ef4444');
        }

        isWaiting = false;
        sendBtn.disabled = false;
        chatInput.focus();
    }

    sendBtn.addEventListener('click', sendMessage);

    chatInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });

    clearChatBtn.addEventListener('click', () => {
        while (chatMessages.children.length > 1) {
            chatMessages.removeChild(chatMessages.lastChild);
        }
        conversationHistory = [];
        showToast('Chat cleared');
    });

    checkBackendHealth().then(isHealthy => {
        if (isHealthy) {
            setConnectionStatus(connectionStatus, 'Connected', '#10b981');
        } else {
            setConnectionStatus(connectionStatus, 'Offline', '#f59e0b');
        }
    });
}
