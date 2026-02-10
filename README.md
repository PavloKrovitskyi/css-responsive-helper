# CSS Responsive Helper

Quick conversion of divisions to **rem**, **percent**, **em** and **fluid responsive clamp()** for CSS-based files.

**Works in:** VS Code, Cursor, VSCodium, and other VSCode-compatible editors.

## Features

### 🎯 Division Conversion
Convert simple divisions to various CSS units with autocomplete:

```css
/* Type: 16/1920 */
width: 0.0083rem; /* 16/1920 */
```

**Available conversions:**
- `rem` - for responsive sizing
- `%` - for percentage-based layouts
- `natural` - decimal values
- `em` - relative to font size

### 🚀 Fluid Responsive Clamp
Create fluid responsive values using CSS `clamp()` function:

```css
/* Type: 40/16>1800-320 then space + Enter */
font-size: clamp(1rem, 0.6757rem + 1.6216vw, 2.5rem); /* 40/16>1800-320 */
```

**Syntax:** `maxValue/minValue>maxViewport-minViewport`

Example: `40/16>1800-320` means:
- Size transitions from **40px** (at 1800px viewport) to **16px** (at 320px viewport)
- Automatically calculates the perfect clamp() formula

## Usage

### Division Conversion

1. Type a division: `24/16`
2. Autocomplete suggestions appear automatically
3. Select the unit you need (rem, %, natural, em)

### Clamp Generation

**Syntax explanation:**
```
maxValue /  minValue >  maxViewport -  minViewport
   40    /     16    >    1800      -     320
   ↓           ↓           ↓               ↓
max size    min size    max width      min width
```

**Space & Enter**
1. Type: `40/16>1800-320 `
2. Press **Space**
3. Press **Enter** to select clamp

This creates a fluid size that smoothly transitions from 40px (at 1800px viewport) down to 16px (at 320px viewport).

## Supported File Types

- CSS
- SCSS
- Sass
- Less
- Stylus
- HTML (inline styles)
- Vue (style section)

## Extension Settings

- `CSSResponsive.comments` (default: `true`) - Add the formula as comment
- `CSSResponsive.fixedDigits` (default: `4`) - Decimal precision for rem/em
- `CSSResponsive.fixedDigitsNatural` (default: `3`) - Decimal precision for natural values

## Examples

### Simple Division
```css
/* Type: 420/1920 */
width: 21.875%; /* 420/1920 */
```

### Fluid Typography
```css
/* Type: 48/24>1920-320  */
font-size: clamp(1.5rem, 1.2973rem + 1.0135vw, 3rem); /* 48/24>1920-320 */
```

### Negative Values
```css
/* Type: 60/-30>1800-320  */
margin-left: clamp(-1.875rem, -3.0912rem + 6.0811vw, 3.75rem); /* 60/-30>1800-320 */
```

## Requirements

No additional requirements needed.

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for details.

## License

MIT
