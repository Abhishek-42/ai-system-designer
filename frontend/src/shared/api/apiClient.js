const CONFIG = {
    FASTAPI_URL: "http://localhost:8001"
};

async function parseJsonResponse(response, fallbackMessage) {
    if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: fallbackMessage }));
        throw new Error(err.detail || fallbackMessage);
    }

    return response.json();
}

export async function checkBackendHealth() {
    try {
        const response = await fetch(`${CONFIG.FASTAPI_URL}/api/health`);
        return response.ok;
    } catch (error) {
        return false;
    }
}

export async function sendChatMessage(message, history, currentDiagram) {
    const response = await fetch(`${CONFIG.FASTAPI_URL}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message,
            history,
            current_diagram: currentDiagram || null
        })
    });

    return parseJsonResponse(response, 'Request failed');
}

export async function fetchDesignState() {
    const response = await fetch(`${CONFIG.FASTAPI_URL}/api/design/state`);
    return parseJsonResponse(response, 'Unable to load design state');
}

export async function applyDesignOperations(operations) {
    const response = await fetch(`${CONFIG.FASTAPI_URL}/api/design/operations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ operations })
    });

    return parseJsonResponse(response, 'Unable to update design state');
}
