module.exports = class Process {
  constructor(config) {
    this.config = config;
    
    // Constants
    this.PX_TO_REM = 16; // 1rem = 16px
    this.VW_MULTIPLIER = 100; // Convert to viewport width percentage
    this.MIN_VIEWPORT_DIGITS = 3; // Minimum digits for viewport validation
    
    // Regex patterns
    this.regex = /-?(\d+)([.]?\d*)?(em|vh|vw|mm|in|pt|pc|ex|ch|rem|vmin|vmax|%)?\/-?(\d+)([.]?\d*)?(em|vh|vw|mm|in|pt|pc|ex|ch|rem|vmin|vmax|%)?/;
    this.regexClamp = /(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)\s*>(\d+)-(\d+)\s/;
    this.regexValues = /em|vh|vw|mm|in|pt|pc|ex|ch|rem|vmin|vmax|%/g;
    
    // Languages that use // comments instead of /* */
    this.noCommaLanguages = ['sass', 'stylus'];
    
    this.setDto();
  }

  calculateExpression(expr) {
    const parts = expr.split('/');
    if (parts.length !== 2) {
      return null;
    }
    const numerator = parseFloat(parts[0]);
    const denominator = parseFloat(parts[1]);
    
    if (isNaN(numerator) || isNaN(denominator)) {
      return null;
    }
    
    if (denominator === 0) {
      return null;
    }
    
    return numerator / denominator;
  }

  /**
   * Calculate CSS clamp() function for fluid responsive values
   * @param {number} minValue - Minimum size in pixels
   * @param {number} maxValue - Maximum size in pixels
   * @param {number} minViewport - Minimum viewport width in pixels
   * @param {number} maxViewport - Maximum viewport width in pixels
   * @returns {string} CSS clamp() formula
   */
  calculateClamp(minValue, maxValue, minViewport, maxViewport) {
    // Calculate slope and intercept in pixels first
    const slope = (maxValue - minValue) / (maxViewport - minViewport);
    const intercept = minValue - slope * minViewport;
    
    // Convert to rem and vw units
    const minRem = minValue / this.PX_TO_REM;
    const maxRem = maxValue / this.PX_TO_REM;
    const interceptRem = intercept / this.PX_TO_REM;
    const vwValue = slope * this.VW_MULTIPLIER;
    
    // For clamp(), first value must be <= third value
    const clampMin = Math.min(minRem, maxRem);
    const clampMax = Math.max(minRem, maxRem);
    
    // Format values with proper precision
    const clampMinFormatted = this.formatValue(clampMin, this.config.fixedDigits);
    const clampMaxFormatted = this.formatValue(clampMax, this.config.fixedDigits);
    const interceptFormatted = this.formatValue(interceptRem, this.config.fixedDigits);
    const vwFormatted = this.formatValue(Math.abs(vwValue), this.config.fixedDigits);
    
    // Build the preferred value part with correct sign
    const sign = vwValue >= 0 ? '+' : '-';
    const preferredValue = `${interceptFormatted}rem ${sign} ${vwFormatted}vw`;
    
    return `clamp(${clampMinFormatted}rem, ${preferredValue}, ${clampMaxFormatted}rem)`;
  }

  formatValue(value, digits) {
    const formatted = Number(value.toFixed(digits));
    // Remove trailing zeros after decimal point
    return formatted;
  }

  setDto(key = null, insertText = null, result = null, resultText = null) {
    if (key) {
      this.dto[key] = { insertText, result, resultText };
    } else {
      this.dto = {};
      ['rem', 'percent', 'natural', 'em', 'clamp'].forEach(v => this.setDto(v));
    }
  }

  getResultText(percent, language, insertText, suffix = '', isClamp = false) {
    var resultText = isClamp ? `${percent};` : `${percent.toString()}${suffix};`;

    if (this.config.comments) {
      resultText += ` /* ${insertText} */`;
    }
    return this.handleSyntaxLanguage(resultText, language);
  }

  handleSyntaxLanguage(text, language) {
    if (this.noCommaLanguages.indexOf(language) > -1) {
      text = text.replace(';', '').replace('/*', '//').replace('*/', '').trim();
    }
    return text;
  }

  isNotNumber(value) {
    return Number.isNaN(value) || value === Infinity;
  }

  run(line, language) {
    // Reset the dto
    this.setDto();
    
    // Check for clamp syntax first: 40/16>1800-320  (space = trigger for clamp)
    // maxValue/minValue>maxViewport-minViewport space
    const clampMatch = this.regexClamp.exec(line);
    if (clampMatch) {
      const insertText = clampMatch[0];
      const maxValue = parseFloat(clampMatch[1]);
      const minValue = parseFloat(clampMatch[2]);
      const maxViewport = parseFloat(clampMatch[3]);
      const minViewport = parseFloat(clampMatch[4]);
      const minViewportStr = clampMatch[4];
      
      // Validate: viewport must be at least 3 digits to avoid premature matching
      // (e.g., avoid matching "40/16>1800-32" when user wants "40/16>1800-320")
      if (minViewportStr.length < this.MIN_VIEWPORT_DIGITS) {
        return this.dto;
      }
      
      if (!isNaN(minValue) && !isNaN(maxValue) && !isNaN(minViewport) && !isNaN(maxViewport) && maxViewport > minViewport) {
        const clampResult = this.calculateClamp(minValue, maxValue, minViewport, maxViewport);
        
        // Remove trailing space from insertText for the comment
        const insertTextClean = insertText.trim().replace(/\s+>/, '>');
        
        this.setDto(
          'clamp',
          insertText,
          clampResult,
          this.getResultText(clampResult, language, insertTextClean, '', true)
        );
      }
      
      return this.dto;
    }
    
    // Original division logic
    if (this.regex.test(line)) {
      var insertText = this.regex.exec(line).shift();
      var expr = insertText.replace(this.regexValues, '');
      var calculatedValue = this.calculateExpression(expr);
      
      if (calculatedValue === null) {
        return this.dto;
      }
      
      var result = {
        'rem': {
          value: calculatedValue,
          suffix: 'rem'
        },
        'percent': {
          value: calculatedValue * 100,
          suffix: '%'
        },
        'natural': {
          value: calculatedValue,
          suffix: ''
        },
        'em': {
          value: calculatedValue,
          suffix: 'em'
        }
      };

      for (let key in result) {
        let { value, suffix } = result[key];

        if (this.isNotNumber(value)) {
          continue;
        }

        if (!Number.isInteger(value)) {
          const fixedDigits = key === 'natural' ? this.config.fixedDigitsNatural : this.config.fixedDigits;

          value = Number(
            Number
              .parseFloat(value.toString())
              .toFixed(fixedDigits)
          );
        }

        this.setDto(
          key,
          insertText,
          value,
          this.getResultText(value, language, insertText, suffix)
        );
      }
    }

    return this.dto;
  }
}
