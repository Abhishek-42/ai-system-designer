import { applyDesignOperations, fetchDesignState } from '../../shared/api/apiClient.js';
import { showToast } from '../../shared/utils/formatters.js';

let nodeIdCounter = 0;
let edgeIdCounter = 0;
let connectMode = false;
let connectSource = null;

export let cyInstance = null;

const FALLBACK_DOCUMENT = {
    nodes: [
        { id: 'n1', data: { label: 'Client', kind: 'actor' }, position: { x: 180, y: 220 } },
        { id: 'n2', data: { label: 'API service', kind: 'service' }, position: { x: 430, y: 220 } },
        { id: 'n3', data: { label: 'Design store', kind: 'storage' }, position: { x: 680, y: 220 } }
    ],
    edges: [
        { id: 'e1', source: 'n1', target: 'n2', data: { label: null } },
        { id: 'e2', source: 'n2', target: 'n3', data: { label: null } }
    ]
};

export function normalizeNode(node) {
    return {
        data: {
            id: node.id,
            label: node.data.label,
            kind: node.data.kind || 'service'
        },
        position: node.position
    };
}

export function normalizeEdge(edge) {
    return {
        data: {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: edge.data?.label || ''
        }
    };
}

export function updateCounters(document) {
    const nodeNumbers = document.nodes
        .map(node => Number.parseInt(node.id.replace(/^n/, ''), 10))
        .filter(Number.isFinite);
    const edgeNumbers = document.edges
        .map(edge => Number.parseInt(edge.id.replace(/^e/, ''), 10))
        .filter(Number.isFinite);

    nodeIdCounter = nodeNumbers.length ? Math.max(...nodeNumbers) : 0;
    edgeIdCounter = edgeNumbers.length ? Math.max(...edgeNumbers) : 0;
}

export function updateInfo() {
    if (!cyInstance) {
        return;
    }

    document.getElementById('nodeCount').textContent = 'Nodes: ' + cyInstance.nodes().length;
    document.getElementById('edgeCount').textContent = 'Edges: ' + cyInstance.edges().length;
    document.getElementById('zoomLevel').textContent = 'Zoom: ' + Math.round(cyInstance.zoom() * 100) + '%';
}

function removeContextMenu() {
    const menu = document.querySelector('.context-menu');
    if (menu) {
        menu.remove();
    }
}

function toggleConnectMode(container, addEdgeBtn) {
    connectMode = !connectMode;
    connectSource = null;
    addEdgeBtn.classList.toggle('active', connectMode);
    container.style.cursor = connectMode ? 'crosshair' : '';
}

async function addNode(x, y, label) {
    if (!cyInstance) {
        return null;
    }

    const nextNode = {
        id: 'n' + (++nodeIdCounter),
        data: {
            label: label || 'Node ' + nodeIdCounter,
            kind: 'service',
            metadata: {}
        },
        position: {
            x: x !== undefined ? x : cyInstance.width() / 2 + (Math.random() - 0.5) * 80,
            y: y !== undefined ? y : cyInstance.height() / 2 + (Math.random() - 0.5) * 80
        }
    };

    await applyDesignOperations([{ type: 'add_node', node: nextNode }]);
    cyInstance.add(normalizeNode(nextNode));
    showToast('Node added');
    return nextNode.id;
}

async function deleteSelected() {
    if (!cyInstance) {
        return;
    }

    const selectedNodes = cyInstance.nodes(':selected');
    const selectedEdges = cyInstance.edges(':selected');
    if (!selectedNodes.length && !selectedEdges.length) {
        return;
    }

    const deletedNodeIds = new Set(selectedNodes.map(node => node.id()));
    const operations = [
        ...selectedNodes.map(node => ({ type: 'delete_node', node_id: node.id() })),
        ...selectedEdges
            .filter(edge => !deletedNodeIds.has(edge.source().id()) && !deletedNodeIds.has(edge.target().id()))
            .map(edge => ({ type: 'delete_edge', edge_id: edge.id() }))
    ];

    await applyDesignOperations(operations);
    cyInstance.$(':selected').remove();
    showToast(operations.length + ' item(s) removed');
}

export async function clearCanvasDocument() {
    await applyDesignOperations([{ type: 'clear_diagram' }]);
    if (cyInstance) {
        cyInstance.elements().remove();
    }
    showToast('Canvas cleared');
}

async function loadDocument() {
    try {
        return await fetchDesignState();
    } catch (error) {
        showToast('Using fallback canvas state');
        return FALLBACK_DOCUMENT;
    }
}

export function setupCanvas() {
    const container = document.getElementById('cy');
    if (!container) {
        return;
    }

    const addEdgeBtn = document.getElementById('addEdgeBtn');

    loadDocument().then(documentState => {
        updateCounters(documentState);

        cyInstance = window.cytoscape({
            container,
            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(label)',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'color': '#e8e4df',
                        'font-family': 'Inter, sans-serif',
                        'font-size': '11px',
                        'font-weight': '500',
                        'background-color': '#111111',
                        'border-width': 1,
                        'border-color': 'rgba(196,168,130,0.2)',
                        'width': 130,
                        'height': 44,
                        'shape': 'roundrectangle',
                        'text-wrap': 'wrap',
                        'text-max-width': '110px',
                        'overlay-padding': '5px',
                        'transition-property': 'border-color, border-width, background-color, shadow-blur, shadow-color',
                        'transition-duration': '0.3s',
                        'shadow-blur': 0,
                        'shadow-color': 'rgba(196,168,130,0)',
                        'shadow-offset-x': 0,
                        'shadow-offset-y': 0,
                        'shadow-opacity': 0
                    }
                },
                {
                    selector: 'node:hover',
                    style: {
                        'border-color': 'rgba(196,168,130,0.35)',
                        'background-color': '#151515',
                        'shadow-blur': 15,
                        'shadow-color': 'rgba(196,168,130,0.06)',
                        'shadow-opacity': 1
                    }
                },
                {
                    selector: 'node:selected',
                    style: {
                        'border-color': '#c4a882',
                        'border-width': 1.5,
                        'background-color': '#161616',
                        'shadow-blur': 20,
                        'shadow-color': 'rgba(196,168,130,0.1)',
                        'shadow-opacity': 1
                    }
                },
                {
                    selector: 'node:active',
                    style: { 'overlay-color': '#c4a882', 'overlay-opacity': 0.06 }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 1.2,
                        'line-color': 'rgba(196,168,130,0.15)',
                        'target-arrow-color': 'rgba(196,168,130,0.2)',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'arrow-scale': 0.7,
                        'line-style': 'solid',
                        'transition-property': 'line-color, target-arrow-color, width',
                        'transition-duration': '0.3s'
                    }
                },
                {
                    selector: 'edge:hover',
                    style: {
                        'line-color': 'rgba(196,168,130,0.3)',
                        'target-arrow-color': 'rgba(196,168,130,0.35)',
                        'width': 1.5
                    }
                },
                {
                    selector: 'edge:selected',
                    style: {
                        'line-color': '#c4a882',
                        'target-arrow-color': '#c4a882',
                        'width': 1.8
                    }
                }
            ],
            elements: [
                ...documentState.nodes.map(normalizeNode),
                ...documentState.edges.map(normalizeEdge)
            ],
            layout: { name: 'preset' },
            minZoom: 0.15,
            maxZoom: 3.5,
            wheelSensitivity: 0.25
        });

        window.cy = cyInstance;
        window.addCanvasNode = addNode;

        cyInstance.on('add remove zoom', updateInfo);
        updateInfo();

        cyInstance.on('tap', 'node', async evt => {
            if (!connectMode) {
                return;
            }

            if (!connectSource) {
                connectSource = evt.target.id();
                evt.target.style('border-color', '#c4a882');
                return;
            }

            const target = evt.target.id();
            if (target !== connectSource) {
                const edge = {
                    id: 'e' + (++edgeIdCounter),
                    source: connectSource,
                    target,
                    data: { label: null, metadata: {} }
                };

                try {
                    await applyDesignOperations([{ type: 'add_edge', edge }]);
                    cyInstance.add(normalizeEdge(edge));
                    showToast('Nodes connected');
                } catch (error) {
                    edgeIdCounter -= 1;
                    showToast(error.message);
                }
            }

            cyInstance.getElementById(connectSource).removeStyle('border-color');
            toggleConnectMode(container, addEdgeBtn);
        });

        cyInstance.on('dbltap', 'node', async evt => {
            const node = evt.target;
            const label = prompt('Edit node label:', node.data('label'));
            if (label === null || !label.trim()) {
                return;
            }

            await applyDesignOperations([
                {
                    type: 'update_node',
                    node_id: node.id(),
                    updates: { label: label.trim() }
                }
            ]);
            node.data('label', label.trim());
            showToast('Node updated');
        });

        cyInstance.on('cxttap', evt => {
            removeContextMenu();

            const pos = evt.renderedPosition || evt.position;
            const menu = document.createElement('div');
            menu.className = 'context-menu';
            menu.style.left = pos.x + 'px';
            menu.style.top = pos.y + 'px';

            if (evt.target === cyInstance) {
                const modelPosition = evt.position;
                menu.innerHTML =
                    '<button class="context-menu-item" data-action="add">Add Node</button>' +
                    '<div class="context-menu-divider"></div>' +
                    '<button class="context-menu-item" data-action="fit">Fit View</button>';
                menu.querySelector('[data-action="add"]').onclick = async () => {
                    await addNode(modelPosition.x, modelPosition.y);
                    removeContextMenu();
                };
                menu.querySelector('[data-action="fit"]').onclick = () => {
                    cyInstance.fit(null, 50);
                    removeContextMenu();
                };
            } else if (evt.target.isNode()) {
                menu.innerHTML =
                    '<button class="context-menu-item" data-action="edit">Edit Label</button>' +
                    '<div class="context-menu-divider"></div>' +
                    '<button class="context-menu-item danger" data-action="delete">Delete</button>';
                menu.querySelector('[data-action="edit"]').onclick = async () => {
                    const label = prompt('Edit label:', evt.target.data('label'));
                    if (label !== null && label.trim()) {
                        await applyDesignOperations([
                            {
                                type: 'update_node',
                                node_id: evt.target.id(),
                                updates: { label: label.trim() }
                            }
                        ]);
                        evt.target.data('label', label.trim());
                        showToast('Node updated');
                    }
                    removeContextMenu();
                };
                menu.querySelector('[data-action="delete"]').onclick = async () => {
                    await applyDesignOperations([{ type: 'delete_node', node_id: evt.target.id() }]);
                    evt.target.remove();
                    showToast('Node removed');
                    removeContextMenu();
                };
            } else if (evt.target.isEdge()) {
                menu.innerHTML = '<button class="context-menu-item danger" data-action="delete">Delete Edge</button>';
                menu.querySelector('[data-action="delete"]').onclick = async () => {
                    await applyDesignOperations([{ type: 'delete_edge', edge_id: evt.target.id() }]);
                    evt.target.remove();
                    showToast('Edge removed');
                    removeContextMenu();
                };
            }

            document.body.appendChild(menu);
            const rect = menu.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                menu.style.left = (window.innerWidth - rect.width - 8) + 'px';
            }
            if (rect.bottom > window.innerHeight) {
                menu.style.top = (window.innerHeight - rect.height - 8) + 'px';
            }
        });

        document.addEventListener('click', removeContextMenu);
        cyInstance.on('tap', removeContextMenu);

        document.addEventListener('keydown', async e => {
            if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
                return;
            }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                await deleteSelected();
            }
            if (e.key === 'a' && e.ctrlKey) {
                e.preventDefault();
                cyInstance.elements().select();
            }
        });

        document.getElementById('addNodeBtn').addEventListener('click', async () => {
            try {
                await addNode();
            } catch (error) {
                nodeIdCounter -= 1;
                showToast(error.message);
            }
        });
        document.getElementById('addEdgeBtn').addEventListener('click', () => toggleConnectMode(container, addEdgeBtn));
        document.getElementById('deleteSelectedBtn').addEventListener('click', async () => {
            try {
                await deleteSelected();
            } catch (error) {
                showToast(error.message);
            }
        });
        document.getElementById('zoomInBtn').addEventListener('click', () => {
            cyInstance.zoom({
                level: cyInstance.zoom() * 1.3,
                renderedPosition: { x: cyInstance.width() / 2, y: cyInstance.height() / 2 }
            });
        });
        document.getElementById('zoomOutBtn').addEventListener('click', () => {
            cyInstance.zoom({
                level: cyInstance.zoom() / 1.3,
                renderedPosition: { x: cyInstance.width() / 2, y: cyInstance.height() / 2 }
            });
        });
        document.getElementById('fitBtn').addEventListener('click', () => cyInstance.fit(null, 50));

        // ── Canvas / Code View Toggle ──
        const viewCanvasBtn = document.getElementById('viewCanvasBtn');
        const viewCodeBtn = document.getElementById('viewCodeBtn');
        const codeEditorPanel = document.getElementById('codeEditorPanel');
        const codeEditor = document.getElementById('codeEditor');
        const applyCodeBtn = document.getElementById('applyCodeBtn');
        const canvasEl = document.getElementById('cy');

        function serializeToJson() {
            if (!cyInstance) return '{}';
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
            return JSON.stringify({ nodes, edges }, null, 2);
        }

        function switchToCanvas() {
            viewCanvasBtn.classList.add('active');
            viewCodeBtn.classList.remove('active');
            codeEditorPanel.style.display = 'none';
            canvasEl.style.display = '';
            cyInstance.resize();
            cyInstance.fit(null, 50);
        }

        function switchToCode() {
            viewCodeBtn.classList.add('active');
            viewCanvasBtn.classList.remove('active');
            codeEditor.value = serializeToJson();
            canvasEl.style.display = 'none';
            codeEditorPanel.style.display = 'flex';
        }

        if (viewCanvasBtn) viewCanvasBtn.addEventListener('click', switchToCanvas);
        if (viewCodeBtn) viewCodeBtn.addEventListener('click', switchToCode);

        // Apply edited JSON back to canvas
        if (applyCodeBtn) {
            applyCodeBtn.addEventListener('click', async () => {
                let parsed;
                try {
                    parsed = JSON.parse(codeEditor.value);
                } catch (err) {
                    showToast('Invalid JSON: ' + err.message);
                    return;
                }

                if (!parsed.nodes || !parsed.edges) {
                    showToast('JSON must have "nodes" and "edges" arrays');
                    return;
                }

                try {
                    // Clear current diagram and rebuild from JSON
                    await applyDesignOperations([{ type: 'clear_diagram' }]);
                    cyInstance.elements().remove();

                    const addOps = [
                        ...parsed.nodes.map(n => ({ type: 'add_node', node: n })),
                        ...parsed.edges.map(e => ({ type: 'add_edge', edge: e }))
                    ];
                    await applyDesignOperations(addOps);

                    parsed.nodes.forEach(n => cyInstance.add(normalizeNode(n)));
                    parsed.edges.forEach(e => cyInstance.add(normalizeEdge(e)));

                    updateCounters(parsed);
                    updateInfo();

                    showToast('Code applied to canvas');
                    switchToCanvas();
                } catch (err) {
                    showToast('Apply failed: ' + err.message);
                }
            });
        }

        // Tab key support in code editor
        if (codeEditor) {
            codeEditor.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = codeEditor.selectionStart;
                    const end = codeEditor.selectionEnd;
                    codeEditor.value = codeEditor.value.substring(0, start) + '  ' + codeEditor.value.substring(end);
                    codeEditor.selectionStart = codeEditor.selectionEnd = start + 2;
                }
            });
        }
    });
}
