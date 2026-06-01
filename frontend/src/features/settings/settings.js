import { clearCanvasDocument, cyInstance } from '../canvas/canvas.js';
import { showToast } from '../../shared/utils/formatters.js';

export function setupSettings() {
    // --- Section Accordion ---
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => {
            const section = header.getAttribute('data-section');
            const body = document.querySelector('[data-body="' + section + '"]');
            if (!body) return;
            
            header.classList.toggle('collapsed');
            body.classList.toggle('open');
        });
    });

    // --- Canvas Toggles ---
    const gridToggle = document.getElementById('gridToggle');
    const snapToggle = document.getElementById('snapToggle');
    const minimapToggle = document.getElementById('minimapToggle');

    // Grid background overlay
    function updateGrid() {
        const canvas = document.getElementById('cy');
        if (!canvas) return;
        
        if (gridToggle.checked) {
            canvas.style.backgroundImage = 'radial-gradient(circle, rgba(120,130,180,0.12) 1px, transparent 1px)';
            canvas.style.backgroundSize = '25px 25px';
        } else {
            canvas.style.backgroundImage = 'none';
        }
    }
    
    if (gridToggle) {
        gridToggle.addEventListener('change', updateGrid);
        updateGrid(); // Initial call
    }

    // Snap to grid handler
    function snapHandler(evt) {
        const node = evt.target;
        const pos = node.position();
        const gridSize = 25;
        node.position({
            x: Math.round(pos.x / gridSize) * gridSize,
            y: Math.round(pos.y / gridSize) * gridSize,
        });
    }

    if (snapToggle) {
        snapToggle.addEventListener('change', () => {
            if (!cyInstance) return;
            
            if (snapToggle.checked) {
                cyInstance.on('free', 'node', snapHandler);
                showToast('Snap to grid enabled');
            } else {
                cyInstance.off('free', 'node', snapHandler);
                showToast('Snap to grid disabled');
            }
        });
    }

    // Minimap toggle (placeholder)
    if (minimapToggle) {
        minimapToggle.addEventListener('change', () => {
            showToast(minimapToggle.checked ? 'Minimap coming soon' : 'Minimap disabled');
        });
    }

    // --- Node Style Customization ---
    const nodeColor = document.getElementById('nodeColor');
    const nodeShape = document.getElementById('nodeShape');

    if (nodeColor) {
        nodeColor.addEventListener('input', () => {
            if (!cyInstance) return;
            cyInstance.style().selector('node').style('border-color', nodeColor.value).update();
        });
    }

    if (nodeShape) {
        nodeShape.addEventListener('change', () => {
            if (!cyInstance) return;
            cyInstance.style().selector('node').style('shape', nodeShape.value).update();
            showToast('Node shape updated');
        });
    }

    // --- Action Buttons ---
    const autoLayoutBtn = document.getElementById('autoLayoutBtn');
    if (autoLayoutBtn) {
        autoLayoutBtn.addEventListener('click', () => {
            if (!cyInstance) return;
            cyInstance.layout({
                name: 'grid',
                padding: 50,
                avoidOverlap: true,
                animate: true,
                animationDuration: 400,
            }).run();
            showToast('Auto layout applied');
        });
    }

    const exportJsonBtn = document.getElementById('exportJsonBtn');
    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', () => {
            if (!cyInstance) return;
            const data = cyInstance.json().elements;
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url; 
            a.download = 'diagram_export.json';
            a.click();
            
            URL.revokeObjectURL(url);
            showToast('Diagram exported');
        });
    }

    const clearCanvasBtn = document.getElementById('clearCanvasBtn');
    if (clearCanvasBtn) {
        clearCanvasBtn.addEventListener('click', async () => {
            if (!cyInstance) return;
            if (confirm('Clear all nodes and edges? This cannot be undone.')) {
                try {
                    await clearCanvasDocument();
                } catch (error) {
                    showToast(error.message);
                }
            }
        });
    }

    // --- Collapse Settings Panel ---
    const collapseBtn = document.getElementById('collapseSettingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');

    if (collapseBtn && settingsPanel) {
        collapseBtn.addEventListener('click', () => {
            settingsPanel.classList.toggle('collapsed');
            
            // Resize cytoscape after CSS animation finishes
            setTimeout(() => {
                if (cyInstance) cyInstance.resize();
            }, 300);
        });
    }
}
