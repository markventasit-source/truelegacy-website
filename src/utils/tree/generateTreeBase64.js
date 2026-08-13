import { toPng } from "html-to-image";

/**
 * Generates high-quality PNG from ReactFlow tree
 * Stable SVG rendering
 * Preserves layout exactly
 * Crops to actual tree content to reduce empty space
 */
export const generateTreeBase64 = async () => {
  const element = document.getElementById("tree");

  if (!element) {
    throw new Error(
      'Tree element not found. Make sure ReactFlow is wrapped with id="tree"'
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 150));

  const hiddenElements = element.querySelectorAll(
    ".react-flow__controls, .react-flow__minimap, .react-flow__attribution"
  );

  hiddenElements.forEach((el) => {
    el.dataset.originalDisplay = el.style.display;
    el.style.display = "none";
  });

  try {
    const treeNodes = element.querySelectorAll(".react-flow__node");
    if (treeNodes.length === 0) {
      throw new Error("No tree nodes found");
    }

    const elementRect = element.getBoundingClientRect();
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    treeNodes.forEach((node) => {
      const rect = node.getBoundingClientRect();

      const relativeX = rect.left - elementRect.left;
      const relativeY = rect.top - elementRect.top;

      minX = Math.min(minX, relativeX);
      maxX = Math.max(maxX, relativeX + rect.width);
      minY = Math.min(minY, relativeY);
      maxY = Math.max(maxY, relativeY + rect.height);
    });

    const padding = 40;
    const cropX = Math.max(0, minX - padding);
    const cropY = Math.max(0, minY - padding);
    const cropWidth = Math.min(
      element.offsetWidth,
      maxX - minX + padding * 2
    );
    const cropHeight = Math.min(
      element.offsetHeight,
      maxY - minY + padding * 2
    );

    const pixelRatio = 2;
    const fullDataUrl = await toPng(element, {
      backgroundColor: "#ffffff",
      pixelRatio,
      cacheBust: true,
      filter: (node) => {
        if (node.tagName === "LINK") return false;
        return true;
      },
      skipFonts: true,
    });

    const img = new Image();
    img.decoding = "async";
    img.src = fullDataUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Failed to load captured image"));
    });

    const sx = Math.round(cropX * pixelRatio);
    const sy = Math.round(cropY * pixelRatio);
    const sw = Math.max(1, Math.round(cropWidth * pixelRatio));
    const sh = Math.max(1, Math.round(cropHeight * pixelRatio));

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to create canvas context");
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

    const OUTPUT_WIDTH = 1084;
    const OUTPUT_HEIGHT = 1168;

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = OUTPUT_WIDTH;
    finalCanvas.height = OUTPUT_HEIGHT;
    const finalCtx = finalCanvas.getContext("2d");
    if (!finalCtx) {
      throw new Error("Failed to create final canvas context");
    }

    finalCtx.fillStyle = "#ffffff";
    finalCtx.fillRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);

    const scale = Math.min(OUTPUT_WIDTH / sw, OUTPUT_HEIGHT / sh);
    const drawW = Math.max(1, Math.round(sw * scale));
    const drawH = Math.max(1, Math.round(sh * scale));
    const dx = Math.round((OUTPUT_WIDTH - drawW) / 2);
    const dy = Math.round((OUTPUT_HEIGHT - drawH) / 2);

    finalCtx.imageSmoothingEnabled = true;
    finalCtx.imageSmoothingQuality = "high";
    finalCtx.drawImage(canvas, 0, 0, sw, sh, dx, dy, drawW, drawH);

    return finalCanvas.toDataURL("image/png");
  } catch (error) {
    throw new Error(`Failed to generate tree image: ${error.message}`);
  } finally {
    hiddenElements.forEach((el) => {
      el.style.display = el.dataset.originalDisplay || "";
      delete el.dataset.originalDisplay;
    });
  }
};