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
        const fullRange = getFullWidgetRange(document, range);
        if (!fullRange) {
            vscode.window.showErrorMessage('Unable to determine widget boundaries');
            return;
        }
        const fullWidgetText = document.getText(fullRange);
        const wrappedText = wrapWithLayoutBuilder(fullWidgetText);
        editor.edit(editBuilder => {
            editBuilder.replace(fullRange, wrappedText);
        }).then(success => {
            // if (success) {
            //     vscode.window.showInformationMessage('Widget wrapped with LayoutBuilder');
            // } else {
            //     vscode.window.showErrorMessage('Failed to wrap widget');
            // }
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
function getFullWidgetRange(document, range) {
    const text = document.getText();
    const startIndex = document.offsetAt(range.start);
    const endIndex = document.offsetAt(range.end);
    // 找到选中文本左侧的第一个字母
    let widgetStart = startIndex;
    while (widgetStart > 0 && /[a-zA-Z]/.test(text[widgetStart - 1])) {
        widgetStart--;
    }
    // 找到选中文本之后的第一个左括号
    let openParenIndex = endIndex;
    while (openParenIndex < text.length && text[openParenIndex] !== '(') {
        openParenIndex++;
    }
    if (openParenIndex === text.length) {
        return null; // 没有找到左括号
    }
    // 找到匹配的右括号
    let openParenCount = 1;
    let closeParenIndex = openParenIndex + 1;
    while (closeParenIndex < text.length && openParenCount > 0) {
        if (text[closeParenIndex] === '(') {
            openParenCount++;
        }
        else if (text[closeParenIndex] === ')') {
            openParenCount--;
        }
        closeParenIndex++;
    }
    if (openParenCount !== 0) {
        return null; // 没有找到匹配的右括号
    }
    return new vscode.Range(document.positionAt(widgetStart), document.positionAt(closeParenIndex));
}
function wrapWithLayoutBuilder(widget) {
    return `LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
            return ${widget.trim()};
        },
    )`;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map