export const colors = {
  bgPure: "#050505",
  bgDeep: "#0a0a0a",
  bgRich: "#0e0e0e",
  bgSoft: "#141414",
  bgElevated: "#1a1a1a",
  bgHover: "#1f1f1f",
  gold: "#c4a882",
  goldDim: "#8b7355",
  goldGlow: "#c4a88218",
  goldGlowStrong: "#c4a88228",
  steel: "#5a6a7a",
  ember: "#7a4a3a",
  textPrimary: "#e8e4df",
  textBody: "#cfc7be",
  textSecondary: "#a59c92",
  textMuted: "#7a756e",
  textGhost: "#4a4540",
  lineGhost: "#ffffff0a",
  lineSubtle: "#ffffff12",
  lineAccent: "#c4a88233",
  lineEmber: "#7a4a3a33",
  white: "#ffffff",
};

export function addBackground(ctx, slide) {
  ctx.addShape(slide, {
    x: 0,
    y: 0,
    width: ctx.W,
    height: ctx.H,
    fill: colors.bgPure,
    line: ctx.line(colors.bgPure, 0),
    name: "background",
  });

  ctx.addShape(slide, {
    x: 34,
    y: 28,
    width: ctx.W - 68,
    height: ctx.H - 56,
    fill: colors.bgDeep,
    line: ctx.line(colors.lineGhost, 1),
    name: "main-frame",
  });

  ctx.addShape(slide, {
    x: 902,
    y: 28,
    width: 272,
    height: 52,
    fill: colors.goldGlow,
    line: ctx.line(colors.goldGlow, 0),
    name: "accent-top",
  });

  ctx.addShape(slide, {
    x: 34,
    y: 548,
    width: 184,
    height: 70,
    fill: "#5a6a7a12",
    line: ctx.line("#5a6a7a12", 0),
    name: "accent-bottom",
  });

  for (const x of [112, 408, 704, 1000]) {
    ctx.addShape(slide, {
      x,
      y: 76,
      width: 1,
      height: 560,
      fill: colors.lineGhost,
      line: ctx.line(colors.lineGhost, 0),
      name: `grid-v-${x}`,
    });
  }

  for (const y of [160, 304, 448, 592]) {
    ctx.addShape(slide, {
      x: 54,
      y,
      width: 1172,
      height: 1,
      fill: colors.lineGhost,
      line: ctx.line(colors.lineGhost, 0),
      name: `grid-h-${y}`,
    });
  }
}

export function addChrome(ctx, slide, sectionLabel = "PROJECT PRESENTATION") {
  ctx.addShape(slide, {
    x: 34,
    y: 28,
    width: ctx.W - 68,
    height: 34,
    fill: colors.bgRich,
    line: ctx.line(colors.lineGhost, 1),
    name: "chrome-bar",
  });

  ctx.addShape(slide, {
    x: 50,
    y: 41,
    width: 8,
    height: 8,
    fill: colors.gold,
    line: ctx.line(colors.gold, 0),
    name: "chrome-dot",
  });

  ctx.addText(slide, {
    x: 68,
    y: 35,
    width: 260,
    height: 20,
    text: "DiagramMaker AI workspace",
    fontSize: 10,
    color: colors.textMuted,
    face: ctx.fonts.mono,
    name: "chrome-title",
  });

  ctx.addText(slide, {
    x: 1020,
    y: 35,
    width: 180,
    height: 20,
    text: sectionLabel,
    fontSize: 10,
    bold: true,
    color: colors.goldDim,
    face: ctx.fonts.mono,
    align: "right",
    name: "chrome-section",
  });
}

export function addKicker(ctx, slide, text, options = {}) {
  const x = options.x ?? 74;
  const y = options.y ?? 88;
  ctx.addShape(slide, {
    x,
    y: y + 13,
    width: 44,
    height: 2,
    fill: colors.gold,
    line: ctx.line(colors.gold, 0),
    name: "kicker-marker",
  });

  return ctx.addText(slide, {
    x: x + 58,
    y,
    width: options.width ?? 240,
    height: 28,
    text: String(text ?? ""),
    fontSize: 12,
    bold: true,
    color: colors.goldDim,
    face: ctx.fonts.mono,
    valign: "mid",
    name: "kicker-label",
  });
}

export function addTitle(ctx, slide, text, options = {}) {
  return ctx.addText(slide, {
    x: options.x ?? 74,
    y: options.y ?? 126,
    width: options.width ?? 640,
    height: options.height ?? 102,
    text: String(text ?? ""),
    fontSize: options.fontSize ?? 31,
    bold: true,
    color: options.color ?? colors.textPrimary,
    face: options.face ?? ctx.fonts.title,
    name: options.name ?? "title",
  });
}

export function addBody(ctx, slide, text, options = {}) {
  return ctx.addText(slide, {
    x: options.x ?? 74,
    y: options.y ?? 236,
    width: options.width ?? 520,
    height: options.height ?? 110,
    text: String(text ?? ""),
    fontSize: options.fontSize ?? 19,
    color: options.color ?? colors.textBody,
    face: options.face ?? ctx.fonts.body,
    name: options.name ?? "body",
  });
}

export function addTag(ctx, slide, options = {}) {
  const width = options.width ?? 132;
  const height = options.height ?? 28;
  ctx.addShape(slide, {
    x: options.x,
    y: options.y,
    width,
    height,
    fill: options.fill ?? colors.goldGlow,
    line: ctx.line(options.line ?? colors.lineAccent, 1),
    name: options.name ?? "tag",
  });

  return ctx.addText(slide, {
    x: options.x + 10,
    y: options.y + 4,
    width: width - 20,
    height: 18,
    text: String(options.text ?? ""),
    fontSize: options.fontSize ?? 11,
    bold: options.bold ?? true,
    color: options.color ?? colors.gold,
    face: options.face ?? ctx.fonts.mono,
    align: options.align ?? "center",
    name: `${options.name ?? "tag"}-text`,
  });
}

export function addPanel(ctx, slide, options = {}) {
  const fill = options.fill ?? colors.bgSoft;
  const border = options.border ?? colors.lineSubtle;
  const titleY = options.y + (options.eyebrow ? 34 : 18);
  const bodyY = titleY + (options.title ? 34 : 12);

  ctx.addShape(slide, {
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    fill,
    line: ctx.line(border, 1),
    name: options.name ?? "panel",
  });

  if (options.accentLine !== false) {
    ctx.addShape(slide, {
      x: options.x,
      y: options.y,
      width: options.width,
      height: 3,
      fill: options.accent ?? colors.gold,
      line: ctx.line(options.accent ?? colors.gold, 0),
      name: `${options.name ?? "panel"}-accent`,
    });
  }

  if (options.eyebrow) {
    ctx.addText(slide, {
      x: options.x + 18,
      y: options.y + 14,
      width: options.width - 36,
      height: 18,
      text: String(options.eyebrow ?? ""),
      fontSize: 10,
      bold: true,
      color: options.eyebrowColor ?? colors.textMuted,
      face: ctx.fonts.mono,
      name: `${options.name ?? "panel"}-eyebrow`,
    });
  }

  if (options.title) {
    ctx.addText(slide, {
      x: options.x + 18,
      y: titleY,
      width: options.width - 36,
      height: options.titleHeight ?? 26,
      text: String(options.title ?? ""),
      fontSize: options.titleSize ?? 20,
      bold: true,
      color: options.titleColor ?? colors.textPrimary,
      face: options.titleFace ?? ctx.fonts.body,
      name: `${options.name ?? "panel"}-title`,
    });
  }

  if (options.body) {
    ctx.addText(slide, {
      x: options.x + 18,
      y: bodyY,
      width: options.width - 36,
      height: options.bodyHeight ?? Math.max(40, options.height - (bodyY - options.y) - 18),
      text: String(options.body ?? ""),
      fontSize: options.bodySize ?? 16,
      color: options.bodyColor ?? colors.textSecondary,
      face: options.bodyFace ?? ctx.fonts.body,
      name: `${options.name ?? "panel"}-body`,
    });
  }
}

export function addMetricPill(ctx, slide, options = {}) {
  const width = options.width ?? 166;
  const height = options.height ?? 58;
  ctx.addShape(slide, {
    x: options.x,
    y: options.y,
    width,
    height,
    fill: options.fill ?? colors.bgSoft,
    line: ctx.line(options.border ?? colors.lineSubtle, 1),
    name: options.name ?? "metric-pill",
  });

  ctx.addText(slide, {
    x: options.x + 14,
    y: options.y + 9,
    width: width - 28,
    height: 14,
    text: String(options.label ?? ""),
    fontSize: options.labelSize ?? 10,
    bold: true,
    color: options.labelColor ?? colors.textMuted,
    face: ctx.fonts.mono,
    name: `${options.name ?? "metric-pill"}-label`,
  });

  ctx.addText(slide, {
    x: options.x + 14,
    y: options.y + 29,
    width: width - 28,
    height: 20,
    text: String(options.value ?? ""),
    fontSize: options.valueSize ?? 16,
    bold: true,
    color: options.valueColor ?? colors.textPrimary,
    face: ctx.fonts.body,
    name: `${options.name ?? "metric-pill"}-value`,
  });
}

export function addFooter(ctx, slide, text = "AI Based Diagram Maker") {
  ctx.addText(slide, {
    x: 74,
    y: 650,
    width: 400,
    height: 18,
    text: String(text ?? ""),
    fontSize: 10,
    color: colors.textGhost,
    face: ctx.fonts.mono,
    name: "footer",
  });
}

function addBubble(ctx, slide, options = {}) {
  ctx.addShape(slide, {
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    fill: options.fill,
    line: ctx.line(options.border, 1),
    name: options.name ?? "bubble",
  });
  ctx.addText(slide, {
    x: options.x + 10,
    y: options.y + 8,
    width: options.width - 20,
    height: options.height - 16,
    text: String(options.text ?? ""),
    fontSize: options.size ?? 9,
    color: options.color ?? colors.textBody,
    face: ctx.fonts.body,
    name: `${options.name ?? "bubble"}-text`,
  });
}

function addCanvasNode(ctx, slide, options = {}) {
  ctx.addShape(slide, {
    x: options.x,
    y: options.y,
    width: options.width ?? 86,
    height: options.height ?? 28,
    fill: colors.bgElevated,
    line: ctx.line(colors.lineAccent, 1),
    name: options.name ?? "canvas-node",
  });
  ctx.addText(slide, {
    x: options.x + 8,
    y: options.y + 6,
    width: (options.width ?? 86) - 16,
    height: 16,
    text: String(options.text ?? ""),
    fontSize: 9,
    color: colors.textBody,
    face: ctx.fonts.body,
    align: "center",
    name: `${options.name ?? "canvas-node"}-text`,
  });
}

export function addAppShellMock(ctx, slide, options = {}) {
  const x = options.x;
  const y = options.y;
  const width = options.width;
  const height = options.height;
  const headerH = 28;
  const toolbarH = 22;
  const footerH = 18;
  const chatW = Math.round(width * 0.27);
  const settingsW = Math.round(width * 0.22);
  const centerW = width - chatW - settingsW;
  const contentY = y + headerH;
  const canvasTop = contentY + toolbarH;
  const canvasH = height - headerH - toolbarH - footerH;
  const centerX = x + chatW;
  const settingsX = x + width - settingsW;
  const nodeW = Math.min(76, Math.max(58, Math.floor((centerW - 54) / 3)));
  const nodeX1 = centerX + 18;
  const nodeX2 = nodeX1 + nodeW + 10;
  const nodeX3 = nodeX2 + nodeW + 10;
  const lowerNodeX1 = centerX + Math.max(34, Math.floor(centerW * 0.22));
  const lowerNodeX2 = centerX + Math.max(96, Math.floor(centerW * 0.54));

  ctx.addShape(slide, {
    x,
    y,
    width,
    height,
    fill: colors.bgRich,
    line: ctx.line(colors.lineSubtle, 1),
    name: options.name ?? "app-shell",
  });

  ctx.addShape(slide, {
    x,
    y,
    width,
    height: headerH,
    fill: colors.bgDeep,
    line: ctx.line(colors.lineGhost, 1),
    name: `${options.name ?? "app-shell"}-header`,
  });

  ctx.addShape(slide, {
    x: x + 10,
    y: y + 10,
    width: 8,
    height: 8,
    fill: colors.gold,
    line: ctx.line(colors.gold, 0),
    name: `${options.name ?? "app-shell"}-icon`,
  });

  ctx.addText(slide, {
    x: x + 24,
    y: y + 6,
    width: 130,
    height: 16,
    text: "DiagramMaker AI",
    fontSize: 9,
    bold: true,
    color: colors.textPrimary,
    face: ctx.fonts.body,
    name: `${options.name ?? "app-shell"}-header-title`,
  });

  ctx.addText(slide, {
    x: x + width - 120,
    y: y + 6,
    width: 96,
    height: 16,
    text: "live prototype",
    fontSize: 8,
    color: colors.textMuted,
    face: ctx.fonts.mono,
    align: "right",
    name: `${options.name ?? "app-shell"}-header-status`,
  });

  ctx.addShape(slide, {
    x,
    y: contentY,
    width: chatW,
    height: height - headerH,
    fill: colors.bgDeep,
    line: ctx.line(colors.lineGhost, 0),
    name: `${options.name ?? "app-shell"}-chat-bg`,
  });

  ctx.addShape(slide, {
    x: settingsX,
    y: contentY,
    width: settingsW,
    height: height - headerH,
    fill: colors.bgDeep,
    line: ctx.line(colors.lineGhost, 0),
    name: `${options.name ?? "app-shell"}-settings-bg`,
  });

  ctx.addShape(slide, {
    x: centerX,
    y: contentY,
    width: centerW,
    height: toolbarH,
    fill: colors.bgDeep,
    line: ctx.line(colors.lineGhost, 0),
    name: `${options.name ?? "app-shell"}-toolbar`,
  });

  ctx.addShape(slide, {
    x: centerX,
    y: y + height - footerH,
    width: centerW,
    height: footerH,
    fill: colors.bgDeep,
    line: ctx.line(colors.lineGhost, 0),
    name: `${options.name ?? "app-shell"}-footer`,
  });

  ctx.addShape(slide, {
    x: x + chatW,
    y: contentY,
    width: 1,
    height: height - headerH,
    fill: colors.lineGhost,
    line: ctx.line(colors.lineGhost, 0),
    name: `${options.name ?? "app-shell"}-divider-left`,
  });

  ctx.addShape(slide, {
    x: settingsX,
    y: contentY,
    width: 1,
    height: height - headerH,
    fill: colors.lineGhost,
    line: ctx.line(colors.lineGhost, 0),
    name: `${options.name ?? "app-shell"}-divider-right`,
  });

  ctx.addShape(slide, {
    x: centerX,
    y: canvasTop,
    width: centerW,
    height: canvasH,
    fill: colors.bgPure,
    line: ctx.line(colors.lineGhost, 0),
    name: `${options.name ?? "app-shell"}-canvas-bg`,
  });

  addBubble(ctx, slide, {
    x: x + 10,
    y: contentY + 18,
    width: chatW - 28,
    height: 46,
    fill: colors.bgSoft,
    border: colors.lineGhost,
    text: "How should I design this system?",
    name: `${options.name ?? "app-shell"}-bubble-1`,
  });
  addBubble(ctx, slide, {
    x: x + 26,
    y: contentY + 76,
    width: chatW - 44,
    height: 54,
    fill: colors.goldGlow,
    border: colors.lineAccent,
    text: "Start with client, API service, and design store.",
    color: colors.textPrimary,
    name: `${options.name ?? "app-shell"}-bubble-2`,
  });
  addBubble(ctx, slide, {
    x: x + 10,
    y: contentY + 144,
    width: chatW - 36,
    height: 42,
    fill: colors.bgSoft,
    border: colors.lineGhost,
    text: "Can I add more nodes later?",
    name: `${options.name ?? "app-shell"}-bubble-3`,
  });

  for (const [index, label] of ["add", "connect", "zoom"].entries()) {
    const pillX = centerX + 12 + index * 52;
    ctx.addShape(slide, {
      x: pillX,
      y: contentY + 4,
      width: 42,
      height: 12,
      fill: colors.bgSoft,
      line: ctx.line(colors.lineGhost, 1),
      name: `${options.name ?? "app-shell"}-tool-${index + 1}`,
    });
    ctx.addText(slide, {
      x: pillX + 6,
      y: contentY + 5,
      width: 30,
      height: 8,
      text: label,
      fontSize: 6,
      color: colors.textSecondary,
      face: ctx.fonts.mono,
      align: "center",
      name: `${options.name ?? "app-shell"}-tool-text-${index + 1}`,
    });
  }

  ctx.addShape(slide, {
    x: nodeX1 + nodeW,
    y: canvasTop + 62,
    width: nodeX2 - (nodeX1 + nodeW),
    height: 2,
    fill: colors.lineAccent,
    line: ctx.line(colors.lineAccent, 0),
    name: `${options.name ?? "app-shell"}-edge-1`,
  });
  ctx.addShape(slide, {
    x: nodeX2 + nodeW,
    y: canvasTop + 62,
    width: nodeX3 - (nodeX2 + nodeW),
    height: 2,
    fill: colors.lineAccent,
    line: ctx.line(colors.lineAccent, 0),
    name: `${options.name ?? "app-shell"}-edge-2`,
  });

  addCanvasNode(ctx, slide, {
    x: nodeX1,
    y: canvasTop + 48,
    width: nodeW,
    text: "Client",
    name: `${options.name ?? "app-shell"}-node-1`,
  });
  addCanvasNode(ctx, slide, {
    x: nodeX2,
    y: canvasTop + 48,
    width: nodeW,
    text: "API",
    name: `${options.name ?? "app-shell"}-node-2`,
  });
  addCanvasNode(ctx, slide, {
    x: nodeX3,
    y: canvasTop + 48,
    width: nodeW,
    text: "Store",
    name: `${options.name ?? "app-shell"}-node-3`,
  });
  addCanvasNode(ctx, slide, {
    x: lowerNodeX1,
    y: canvasTop + 124,
    width: nodeW,
    text: "AI Chat",
    name: `${options.name ?? "app-shell"}-node-4`,
  });
  addCanvasNode(ctx, slide, {
    x: lowerNodeX2,
    y: canvasTop + 126,
    width: nodeW,
    text: "Canvas",
    name: `${options.name ?? "app-shell"}-node-5`,
  });

  ctx.addShape(slide, {
    x: lowerNodeX1 + nodeW,
    y: canvasTop + 138,
    width: lowerNodeX2 - (lowerNodeX1 + nodeW),
    height: 2,
    fill: colors.lineGhost,
    line: ctx.line(colors.lineGhost, 0),
    name: `${options.name ?? "app-shell"}-edge-3`,
  });

  const sectionLabels = ["Canvas", "Node Style", "Actions"];
  sectionLabels.forEach((label, index) => {
    const blockY = contentY + 18 + index * 72;
    ctx.addText(slide, {
      x: settingsX + 12,
      y: blockY,
      width: settingsW - 24,
      height: 14,
      text: label.toUpperCase(),
      fontSize: 8,
      bold: true,
      color: colors.textMuted,
      face: ctx.fonts.mono,
      name: `${options.name ?? "app-shell"}-settings-label-${index + 1}`,
    });

    ctx.addShape(slide, {
      x: settingsX + 12,
      y: blockY + 22,
      width: settingsW - 24,
      height: 1,
      fill: colors.lineGhost,
      line: ctx.line(colors.lineGhost, 0),
      name: `${options.name ?? "app-shell"}-settings-line-${index + 1}`,
    });

    ctx.addShape(slide, {
      x: settingsX + 12,
      y: blockY + 34,
      width: settingsW - 24,
      height: 20,
      fill: colors.bgSoft,
      line: ctx.line(colors.lineGhost, 1),
      name: `${options.name ?? "app-shell"}-settings-pill-${index + 1}`,
    });
  });

  ctx.addText(slide, {
    x: centerX + 14,
    y: y + height - 18,
    width: 120,
    height: 12,
    text: "Nodes 5   Edges 3",
    fontSize: 7,
    color: colors.textGhost,
    face: ctx.fonts.mono,
    name: `${options.name ?? "app-shell"}-canvas-info`,
  });
}
