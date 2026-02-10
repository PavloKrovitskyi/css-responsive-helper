# Change Log

All notable changes to the "CSS Responsive Helper" extension.

## [0.1.0] - 2026-02-10

### Added
- Initial release
- Division to rem/percent/em/natural conversion
- Fluid responsive clamp() generation
- Support for CSS, SCSS, Sass, Less, Stylus, HTML, Vue
- Autocomplete on numeric input
- Configurable decimal precision
- Optional formula comments

### Features
- **Division Conversion**: `16/1920` → various units
- **Clamp Generation**: `40/16>1800-320` → fluid responsive clamp()
- Supports negative values
- Supports decimal values
- Minimum 3-digit viewport validation (prevents premature triggering)
- Space or Ctrl+Space activation

### Configuration
- `CSSResponsive.comments` - Toggle formula comments
- `CSSResponsive.fixedDigits` - Decimal precision for rem/em
- `CSSResponsive.fixedDigitsNatural` - Decimal precision for natural values