import { sendChatMessage, applyDesignOperations, checkBackendHealth } from '../../shared/api/apiClient.js';
import { escapeHtml, formatMarkdown, getTimestamp, showToast } from '../../shared/utils/formatters.js';
import { cyInstance, normalizeNode, normalizeEdge, updateCounters, updateInfo } from '../canvas/canvas.js';

let conversationHistory = [];
let isWaiting = false;

function setConnectionStatus(connectionStatus, label, color) {
    connectionStatus.textContent = label;
    connectionStatus.style.color = color;
}

/**
 * Serialize the current cytoscape canvas state into a lightweight snapshot
 * that gets sent to Groq so it knows what's already on the diagram.
 */
function getCurrentDiagramState() {
    if (!cyInstance) return { nodes: [], edges: [] };

    const nodes = cyInstance.nodes().map(n => ({
        id: n.id(),
        data: { label: n.data('label'), kind: n.data('kind') || 'service' },
        position: { x: Math.round(n.position('x')), y: Math.round(n.position('y')) }
    }));

    const edges = cyInstance.edges().map(e => ({
        id: e.id(),
        source: e.source().id(),
        target: e.target().id(),
        data: { label: e.data('label') || null }
    }));

    return { nodes, edges };
}

/**
 * Execute an array of diagram operations on the cytoscape canvas.
 * Also syncs each batch to the backend via the design operations API.
 */
async function executeDiagramOperations(operations) {
    if (!operations || operations.length === 0 || !cyInstance) return;

    let nodesAdded = 0;
    let edgesAdded = 0;
    let nodesDeleted = 0;
    let edgesDeleted = 0;
    let nodesUpdated = 0;
    let cleared = false;

    try {
        // Send all operations to backend in one batch for persistence
        await applyDesignOperations(operations);

        // Now apply visually on the cytoscape canvas
        for (const op of operations) {
            switch (op.type) {
                case 'clear_diagram':
                    cyInstance.elements().remove();
                    cleared = true;
                    break;

                case 'add_node':
                    if (op.node) {
                        cyInstance.add(normalizeNode(op.node));
                        nodesAdded++;
                    }
                    break;

                case 'add_edge':
                    if (op.edge) {
                        cyInstance.add(normalizeEdge(op.edge));
                        edgesAdded++;
                    }
                    break;

                case 'delete_node':
                    if (op.node_id) {
                        const node = cyInstance.getElementById(op.node_id);
                        if (node.length) node.remove();
                        nodesDeleted++;
                    }
                    break;

                case 'delete_edge':
                    if (op.edge_id) {
                        const edge = cyInstance.getElementById(op.edge_id);
                        if (edge.length) edge.remove();
                        edgesDeleted++;
                    }
                    break;

                case 'update_node':
                    if (op.node_id && op.updates) {
                        const node = cyInstance.getElementById(op.node_id);
                        if (node.length) {
                            if (op.updates.label) node.data('label', op.updates.label);
                            if (op.updates.kind) node.data('kind', op.updates.kind);
                            nodesUpdated++;
                        }
                    }
                    break;
            }
        }

        // Update counters from the current state
        const currentState = getCurrentDiagramState();
        updateCounters(currentState);
        updateInfo();

        // Fit view to show all new elements
        if (cyInstance.elements().length > 0) {
            cyInstance.fit(null, 50);
        }

        // Briefly highlight newly added nodes
        if (nodesAdded > 0) {
            cyInstance.nodes().forEach(n => {
                n.animate({
                    style: { 'border-color': '#c4a882', 'border-width': 2 },
                    duration: 400,
                    complete: () => {
                        n.animate({
                            style: { 'border-color': 'rgba(196,168,130,0.2)', 'border-width': 1 },
                            duration: 600
                        });
                    }
                });
            });
        }

        // Build summary toast
        const parts = [];
        if (cleared) parts.push('Canvas cleared');
        if (nodesAdded) parts.push(nodesAdded + ' node' + (nodesAdded > 1 ? 's' : '') + ' added');
        if (edgesAdded) parts.push(edgesAdded + ' edge' + (edgesAdded > 1 ? 's' : '') + ' added');
        if (nodesDeleted) parts.push(nodesDeleted + ' node' + (nodesDeleted > 1 ? 's' : '') + ' removed');
        if (edgesDeleted) parts.push(edgesDeleted + ' edge' + (edgesDeleted > 1 ? 's' : '') + ' removed');
        if (nodesUpdated) parts.push(nodesUpdated + ' node' + (nodesUpdated > 1 ? 's' : '') + ' updated');

        if (parts.length > 0) {
            showToast('✓ ' + parts.join(', '));
        }
    } catch (error) {
        console.error('Failed to execute diagram operations:', error);
        showToast('Diagram update failed: ' + error.message);
    }
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
            // Send message with current diagram state for context
            const currentDiagram = getCurrentDiagramState();
            const data = await sendChatMessage(message, conversationHistory.slice(0, -1), currentDiagram);

            hideTyping();

            // Show the chat response
            addMessage(data.response, 'model');
            conversationHistory.push({ role: 'model', content: data.response });

            // Execute diagram operations if any
            if (data.operations && data.operations.length > 0) {
                await executeDiagramOperations(data.operations);
            }

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
