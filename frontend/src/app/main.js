import '../styles/main.css';

import { setupChat } from '../features/chat/chat.js';
import { setupCanvas } from '../features/canvas/canvas.js';
import { setupSettings } from '../features/settings/settings.js';

/**
 * Initializes the entire DiagramMaker AI frontend application.
 * This runs as soon as the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize the AI Chat Panel
    setupChat();
    
    // 2. Initialize the Cytoscape.js Canvas
    setupCanvas();
    
    // 3. Initialize the Settings Panel and Action Buttons
    setupSettings();
    
    console.log("DiagramMaker AI initialized successfully.");
});
