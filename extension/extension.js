const vscode = require('vscode');
const Provider = require('./provider.js');
const Process = require('./process.js');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const config = vscode.workspace.getConfiguration('CSSResponsive');
  const process = new Process(config);
  const provider = new Provider(process);

  const TYPES = [
    'html',
    'vue',
    'css',
    'less',
    'scss',
    'sass',
    'stylus'
  ];

  TYPES.forEach(item => {
    let providerDisposable = vscode.languages.registerCompletionItemProvider(
      {
        scheme: 'file',
        language: item
      },
      provider,
      ...['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'x', '>', ' ']
    );
    context.subscriptions.push(providerDisposable);
  });

  // Handle configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('CSSResponsive')) {
        const newConfig = vscode.workspace.getConfiguration('CSSResponsive');
        process.config = newConfig;
      }
    })
  );
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
  activate,
  deactivate
}
