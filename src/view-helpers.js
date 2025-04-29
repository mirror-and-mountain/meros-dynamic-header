/*
 * This file includes helper functions to process the mm-dynamic-header block
 * where the user has opted into 'overlaying' it with start and end colors on scroll.
 * 
 */


/* Color Parser: Converts JSON RGBA or HEX to RGBA format  */
export const mmHeaderColorParser = function (colorString) {
    if (!colorString) return 'transparent';

    try {
        // Check if it's JSON (RGBA format)
        const color = JSON.parse(colorString);
        if (color && typeof color === 'object' && 'r' in color && 'g' in color && 'b' in color) {
            return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ?? 1})`; // Default alpha to 1 if missing
        }
    } catch (error) {
        // Return string if not JSON
        return colorString;
    }
    
    return 'transparent'; // Fallback
};

/* Extract RGBA values for smooth interpolation */
export const parseRgbaValues = (rgba) => {
    const match = rgba.match(/rgba?\((\d+), (\d+), (\d+),? (\d?.?\d+)?\)/);
    return match ? {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
        a: parseFloat(match[4] ?? 1)
    } : { r: 0, g: 0, b: 0, a: 1 };
};

/* Function to interpolate between two RGBA colors */
export const interpolateColor = function (startColor, endColor, opacity) {
    return `rgba(
        ${Math.round(startColor.r + (endColor.r - startColor.r) * opacity)}, 
        ${Math.round(startColor.g + (endColor.g - startColor.g) * opacity)}, 
        ${Math.round(startColor.b + (endColor.b - startColor.b) * opacity)}, 
        ${(startColor.a + (endColor.a - startColor.a) * opacity).toFixed(2)}
    )`;
}

/* Converts HEX to RGBA (Assumes full opacity for solid colors) */
function hexToRgba(hex) {
    let r = 0, g = 0, b = 0;

    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }

    return `rgba(${r}, ${g}, ${b}, 1)`; // Default alpha to 1
}