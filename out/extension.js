"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    const codeActionProvider = vscode.languages.registerCodeActionsProvider({ scheme: 'file', language: 'dart' }, new LayoutBuilderActionProvider());
    const disposable = vscode.commands.registerCommand('extension.wrapWithLayoutBuilder', (document, range) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }
        const selectedText = document.getText(range);
        const wrappedText = wrapWithLayoutBuilder(selectedText);
        editor.edit(editBuilder => {
            editBuilder.replace(range, wrappedText);
        }).then(success => {
            if (success) {
                vscode.window.showInformationMessage('Widget wrapped with LayoutBuilder');
            }
            else {
                vscode.window.showErrorMessage('Failed to wrap widget');
            }
        });
    });
    context.subscriptions.push(codeActionProvider, disposable);
}
exports.activate = activate;
class LayoutBuilderActionProvider {
    provideCodeActions(document, range) {
        const wrapAction = new vscode.CodeAction('Wrap with LayoutBuilder', vscode.CodeActionKind.RefactorRewrite);
        wrapAction.command = {
            command: 'extension.wrapWithLayoutBuilder',
            title: 'Wrap with LayoutBuilder',
            arguments: [document, range]
        };
        return [wrapAction];
    }
}
function wrapWithLayoutBuilder(widget) {
    return `LayoutBuilder(
  builder: (BuildContext context, BoxConstraints constraints) {
    // You can use constraints.maxWidth and constraints.maxHeight here
    return ${widget.trim()};
  },
)`;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map