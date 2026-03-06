/**
 * Color Utilities for html2canvas Compatibility
 * 
 * html2canvas does not support modern CSS color functions like lab() and oklch()
 * which are used by Tailwind CSS v4. This module provides utilities to convert
 * these unsupported color formats to safe alternatives (hex/rgb) before rendering.
 */

/**
 * Regex patterns to detect unsupported CSS color functions
 */
const UNSUPPORTED_COLOR_PATTERNS = {
  lab: /lab\s*\([^)]+\)/gi,
  oklch: /oklch\s*\([^)]+\)/gi,
  lch: /lch\s*\([^)]+\)/gi,
  hwb: /hwb\s*\([^)]+\)/gi,
};

/**
 * Fallback color map for common Tailwind color functions
 * Maps unsupported color functions to their hex equivalents
 */
const FALLBACK_COLORS: { [key: string]: string } = {
  'lab(64.3% 20.1 21.3)': '#d62828', // red-600
  'lab(75.5% 0 0)': '#ffffff', // white
  'lab(97.7% -0.002 0.012)': '#fafafa', // gray-50
  'lab(89.2% -0.006 0.007)': '#f3f4f6', // gray-100
  'lab(81.9% -0.009 0.008)': '#e5e7eb', // gray-200
  'lab(74.5% -0.010 0.009)': '#d1d5db', // gray-300
  'lab(64.3% -0.010 0.008)': '#9ca3af', // gray-400
  'lab(55.4% -0.010 0.008)': '#6b7280', // gray-500
  'lab(46.8% -0.007 0.006)': '#4b5563', // gray-600
  'lab(38.1% -0.007 0.006)': '#374151', // gray-700
  'lab(29.4% -0.006 0.005)': '#1f2937', // gray-800
  'lab(20.9% -0.004 0.004)': '#111827', // gray-900
};

/**
 * Convert Lab color to RGB hex
 * Simple approximation - Lab to XYZ to RGB conversion
 */
function labToHex(labStr: string): string {
  // Try to extract lab values: lab(L a b / alpha)
  const match = labStr.match(/lab\s*\(\s*([\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*(?:\/\s*([\d.]+))?\s*\)/i);
  if (!match) return '#808080'; // Fallback gray

  const L = parseFloat(match[1]);
  const a = parseFloat(match[2]);
  const b = parseFloat(match[3]);

  // Simplified Lab to RGB conversion
  // This is an approximation; for production, consider using a library like chroma.js
  let xyz_x, xyz_y, xyz_z;

  const fy = (L + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const xr = fx * fx * fx;
  const yr = fy * fy * fy;
  const zr = fz * fz * fz;

  xyz_x = (xr > 0.008856 ? xr : (fx - 16 / 116) / 7.787) * 95.047;
  xyz_y = (yr > 0.008856 ? yr : (fy - 16 / 116) / 7.787) * 100.0;
  xyz_z = (zr > 0.008856 ? zr : (fz - 16 / 116) / 7.787) * 108.883;

  // XYZ to RGB
  let r = xyz_x * 3.2406 + xyz_y * -1.5372 + xyz_z * -0.4986;
  let g = xyz_x * -0.9689 + xyz_y * 1.8758 + xyz_z * 0.0415;
  let bl = xyz_x * 0.0557 + xyz_y * -0.204 + xyz_z * 1.057;

  // Apply gamma correction
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  bl = bl > 0.0031308 ? 1.055 * Math.pow(bl, 1 / 2.4) - 0.055 : 12.92 * bl;

  // Clamp values to 0-1
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  bl = Math.max(0, Math.min(1, bl));

  // Convert to hex
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

/**
 * Convert OkLch color to RGB hex
 * Simplified approximation for Tailwind colors
 */
function oklchToHex(oklchStr: string): string {
  // Try to extract oklch values
  const match = oklchStr.match(/oklch\s*\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+))?\s*\)/i);
  if (!match) return '#808080'; // Fallback gray

  const L = parseFloat(match[1]);
  const C = parseFloat(match[2]);
  const h = parseFloat(match[3]);

  // OkLch to OkLab
  const hRad = (h * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // OkLab to linear RGB (simplified)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291486575 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  let r = +4.0767416621 * l - 3.3077363322 * m + 0.2309101289 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193761 * s;
  let bl = -0.004218652921 * l - 0.7034186147 * m + 1.707614701 * s;

  // Apply gamma
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  bl = bl > 0.0031308 ? 1.055 * Math.pow(bl, 1 / 2.4) - 0.055 : 12.92 * bl;

  // Clamp and convert to hex
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  bl = Math.max(0, Math.min(1, bl));

  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

/**
 * Convert any unsupported color function to a safe hex color
 */
function convertUnsupportedColor(colorValue: string): string {
  if (!colorValue) return colorValue;

  // Check in fallback map first
  if (FALLBACK_COLORS[colorValue]) {
    return FALLBACK_COLORS[colorValue];
  }

  // Try to convert lab() colors
  if (colorValue.includes('lab(')) {
    return labToHex(colorValue);
  }

  // Try to convert oklch() colors
  if (colorValue.includes('oklch(')) {
    return oklchToHex(colorValue);
  }

  // Return original if no conversion needed
  return colorValue;
}

/**
 * Aggressively strip and replace unsupported colors in an element's styles
 * This directly modifies the element to use safe colors
 */
export function stripUnsupportedColors(element: HTMLElement): void {
  const allElements = [element, ...Array.from(element.querySelectorAll('*'))];

  allElements.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;

    try {
      // Get the computed styles
      const computed = window.getComputedStyle(el);

      // Extract actual color values and apply them as inline styles
      // This bypasses Tailwind's color function generation
      const colorProps = {
        color: 'color',
        backgroundColor: 'background-color',
        borderColor: 'border-color',
        borderTopColor: 'border-top-color',
        borderRightColor: 'border-right-color',
        borderBottomColor: 'border-bottom-color',
        borderLeftColor: 'border-left-color',
      };

      for (const [cssProp, cssName] of Object.entries(colorProps)) {
        const value = computed.getPropertyValue(cssName);
        
        // If it contains unsupported color functions, try to replace or use fallback
        if (value && (value.includes('lab(') || value.includes('oklch('))) {
          const safeColor = convertUnsupportedColor(value);
          el.style[cssProp as any] = safeColor;
        }
      }

      // Override background images that might contain gradients with functions
      if (el.style.backgroundImage && el.style.backgroundImage.includes('lab(')) {
        el.style.backgroundImage = 'none';
      }
      
      if (el.style.backgroundImage && el.style.backgroundImage.includes('oklch(')) {
        el.style.backgroundImage = 'none';
      }
    } catch (e) {
      // Silently continue if there's any error
    }
  });
}

/**
 * Create a callback function for html2canvas's onclone option
 * This fixes color functions DURING rendering (the most reliable approach)
 * 
 * @returns A function to pass to html2canvas's onclone option
 */
export function getHtml2CanvasOnCloneCallback() {
  return (clonedDocument: Document) => {
    try {
      const allElements = clonedDocument.querySelectorAll('*');

      allElements.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;

        try {
          // Get computed styles
          const computed = clonedDocument.defaultView?.getComputedStyle(el);
          if (!computed) return;

          // Color properties to check
          const colorProps: { [key: string]: string } = {
            'color': 'color',
            'background-color': 'background-color',
            'border-color': 'border-color',
            'border-top-color': 'border-top-color',
            'border-right-color': 'border-right-color',
            'border-bottom-color': 'border-bottom-color',
            'border-left-color': 'border-left-color',
            'outline-color': 'outline-color',
          };

          // Check each color property
          for (const [cssPropName, cssName] of Object.entries(colorProps)) {
            const value = computed.getPropertyValue(cssName);
            
            if (value && (value.includes('lab(') || value.includes('oklch('))) {
              const safeColor = convertUnsupportedColor(value);
              el.setAttribute(
                'style',
                (el.getAttribute('style') || '') + `; ${cssName}: ${safeColor} !important`
              );
            }
          }

          // Also handle inline styles with regex
          const styleAttr = el.getAttribute('style');
          if (styleAttr && (styleAttr.includes('lab(') || styleAttr.includes('oklch('))) {
            let newStyle = styleAttr
              .replace(/lab\s*\([^)]*\)/g, (match) => convertUnsupportedColor(match))
              .replace(/oklch\s*\([^)]*\)/g, (match) => convertUnsupportedColor(match));
            el.setAttribute('style', newStyle);
          }
        } catch (e) {
          // Continue silently
        }
      });
    } catch (e) {
      console.warn('Error in html2canvas onclone callback:', e);
    }
  };
}

/**
 * Clone a DOM element and convert all unsupported CSS colors to safe formats
 * This allows html2canvas to render the element without color function errors
 * 
 * @param element - The DOM element to clone and convert
 * @returns A new cloned element with color-safe styles
 */
export function createColorSafeClone(element: HTMLElement): HTMLElement {
  // Clone the element deeply
  const clone = element.cloneNode(true) as HTMLElement;

  // Get all elements in the clone (including the clone itself)
  const allElements = [clone, ...Array.from(clone.querySelectorAll('*'))];

  allElements.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;

    // Get computed styles
    const computedStyle = window.getComputedStyle(el);

    // Check and fix color properties that might contain unsupported functions
    const colorProperties = [
      'color',
      'backgroundColor',
      'borderColor',
      'borderTopColor',
      'borderRightColor',
      'borderBottomColor',
      'borderLeftColor',
      'outlineColor',
      'textDecorationColor',
      'fill',
      'stroke',
    ];

    colorProperties.forEach((prop) => {
      const value = computedStyle.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
      if (value && (value.includes('lab(') || value.includes('oklch('))) {
        const safeColor = convertUnsupportedColor(value);
        el.style.setProperty(
          prop.replace(/([A-Z])/g, '-$1').toLowerCase(),
          safeColor,
          'important'
        );
      }
    });

    // Also check inline styles for unsupported colors
    if (el.style.cssText) {
      let newCssText = el.style.cssText;

      // Replace lab() colors
      newCssText = newCssText.replace(/lab\s*\([^)]+\)/gi, (match) => convertUnsupportedColor(match));

      // Replace oklch() colors
      newCssText = newCssText.replace(/oklch\s*\([^)]+\)/gi, (match) => convertUnsupportedColor(match));

      if (newCssText !== el.style.cssText) {
        el.style.cssText = newCssText;
      }
    }
  });

  return clone;
}

/**
 * Simple approach: Add a temporary style override to the document
 * This injects CSS that converts problematic colors to safe ones during rendering
 * 
 * @returns A function to remove the injected styles
 */
export function injectColorSafetyStyles(): () => void {
  const style = document.createElement('style');
  
  // Inject CSS that forces safe colors
  style.textContent = `
    * {
      background-color: var(--safe-bgcolor) !important;
      color: var(--safe-color) !important;
      border-color: var(--safe-border-color) !important;
    }
  `;

  document.head.appendChild(style);

  return () => {
    document.head.removeChild(style);
  };
}

/**
 * Clean up an element's computed styles to ensure html2canvas compatibility
 * Removes problematic CSS properties that might cause rendering issues
 * 
 * @param element - The element to clean
 */
export function cleanElementForHtml2Canvas(element: HTMLElement): void {
  const allElements = [element, ...Array.from(element.querySelectorAll('*'))];

  allElements.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;

    // Ensure background images and patterns are removed if problematic
    if (el.style.backgroundImage && el.style.backgroundImage.includes('url(')) {
      // Keep background images but ensure they're accessible
      el.style.backgroundSize = 'cover';
    }

    // Ensure opacity is readable
    if (el.style.opacity) {
      const opacity = parseFloat(el.style.opacity);
      if (opacity < 0.1) {
        el.style.opacity = '1';
      }
    }
  });
}
