import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const codeActionProvider = vscode.languages.registerCodeActionsProvider(
        { scheme: 'file', language: 'dart' },
        new LayoutBuilderActionProvider()
    );

    const disposable = vscode.commands.registerCommand('extension.wrapWithLayoutBuilder', (document: vscode.TextDocument, range: vscode.Range) => {
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
            } else {
                vscode.window.showErrorMessage('Failed to wrap widget');
            }
        });
    });

    context.subscriptions.push(codeActionProvider, disposable);
}

class LayoutBuilderActionProvider implements vscode.CodeActionProvider {
    provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] {
        const wrapAction = new vscode.CodeAction('Wrap with LayoutBuilder', vscode.CodeActionKind.RefactorRewrite);
        wrapAction.command = {
            command: 'extension.wrapWithLayoutBuilder',
            title: 'Wrap with LayoutBuilder',
            arguments: [document, range]
        };
        return [wrapAction];
    }
}

function wrapWithLayoutBuilder(widget: string): string {
    return `LayoutBuilder(
  builder: (BuildContext context, BoxConstraints constraints) {
    // You can use constraints.maxWidth and constraints.maxHeight here
    return ${widget.trim()};
  },
)`;
}

export function deactivate() { }