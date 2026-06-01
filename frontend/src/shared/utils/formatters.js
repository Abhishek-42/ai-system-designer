export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function formatMarkdown(text) {
    if (!text) {
        return '';
    }

    let html = text;
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
        '<pre><code>' + escapeHtml(code.trim()) + '</code></pre>'
    );
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    const paragraphs = html.split(/\n\n+/);
    html = paragraphs.map(paragraph => {
        const cleanParagraph = paragraph.trim();
        if (!cleanParagraph) {
            return '';
        }

        const lines = cleanParagraph.split('\n');
        const isList = lines.every(line => /^[-*]\s/.test(line.trim()) || !line.trim());

        if (isList) {
            const items = lines
                .filter(line => line.trim())
                .map(line => '<li>' + line.replace(/^[-*]\s*/, '') + '</li>')
                .join('');
            return '<ul>' + items + '</ul>';
        }

        if (cleanParagraph.startsWith('<pre>')) {
            return cleanParagraph;
        }

        return '<p>' + cleanParagraph.replace(/\n/g, '<br>') + '</p>';
    }).join('');

    return html;
}

export function getTimestamp() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) {
        existing.remove();
    }

    const toastElement = document.createElement('div');
    toastElement.className = 'toast';
    toastElement.textContent = message;
    document.body.appendChild(toastElement);

    requestAnimationFrame(() => toastElement.classList.add('visible'));

    setTimeout(() => {
        toastElement.classList.remove('visible');
        setTimeout(() => toastElement.remove(), 500);
    }, 2500);
}
