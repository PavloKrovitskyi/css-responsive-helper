const vscode = require('vscode');

module.exports = class CSSResponsiveProvider {
  constructor(process) {
    this.process = process;
  }

  /**
   * Provide completion items for CSS responsive conversions
   * @param {vscode.TextDocument} document - Current document
   * @param {vscode.Position} position - Cursor position
   * @returns {Promise<vscode.CompletionItem[]>} Array of completion items
   */
  provideCompletionItems(document, position) {
    return new Promise((resolve, reject) => {
      const result = [];
      const line = document.lineAt(position);
      const linePrefix = line.text.substring(0, position.character);
      const dto = this.process.run(linePrefix, document.languageId);

      // Define the order of keys with their sort text
      const keysInOrder = [
        { key: 'clamp', sortText: '0' },
        { key: 'rem', sortText: '1' },
        { key: 'percent', sortText: '2' },
        { key: 'natural', sortText: '3' },
        { key: 'em', sortText: '4' }
      ];

      // Iterate over keys in the specified order
      keysInOrder.forEach(({ key, sortText }) => {
        if (dto[key] && dto[key].result !== null) {
          const item = new vscode.CompletionItem(
            `${dto[key].insertText} => ${dto[key].resultText}`,
            vscode.CompletionItemKind.Snippet
          );

          item.insertText = dto[key].resultText;
          item.sortText = sortText;  // Enforce order using sortText

          // Check if there's a semicolon after the cursor and include it in the range
          const fullLine = line.text;
          const charAfterCursor = fullLine.charAt(position.character);
          const endPos = charAfterCursor === ';' ? position.character + 1 : position.character;

          item.range = new vscode.Range(
            position.line,
            position.character - (dto[key].insertText.length),
            position.line,
            endPos
          );

          result.push(item);
        }
      });

      resolve(result);
    });
  }
}
