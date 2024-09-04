import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.wrapWithLayoutBuilder', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const document = editor.document;
        const selection = editor.selection;

        if (selection.isEmpty) {
            vscode.window.showWarningMessage('Please select a widget to wrap');
            return;
        }

        const selectedText = document.getText(selection);
        const wrappedText = wrapWithLayoutBuilder(selectedText);

        editor.edit(editBuilder => {
            editBuilder.replace(selection, wrappedText);
        }).then(success => {
            if (success) {
                vscode.window.showInformationMessage('Widget wrapped with LayoutBuilder');
            } else {
                vscode.window.showErrorMessage('Failed to wrap widget');
            }
        });
    });

    context.subscriptions.push(disposable);
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