import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const codeActionProvider = vscode.languages.registerCodeActionsProvider(
        { scheme: 'file', language: 'dart' },
        new FlutterWrapperActionProvider()
    );

    const layoutBuilderDisposable = vscode.commands.registerCommand('extension.wrapWithLayoutBuilder', (document: vscode.TextDocument, range: vscode.Range) => {
        wrapWidget(document, range, wrapWithLayoutBuilder);
    });

    const obxDisposable = vscode.commands.registerCommand('extension.wrapWithObx', (document: vscode.TextDocument, range: vscode.Range) => {
        wrapWidget(document, range, wrapWithObx);
    });

    context.subscriptions.push(codeActionProvider, layoutBuilderDisposable, obxDisposable);
}

class FlutterWrapperActionProvider implements vscode.CodeActionProvider {
    provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] {
        const actions = [];

        const layoutBuilderAction = new vscode.CodeAction('Wrap with LayoutBuilder', vscode.CodeActionKind.RefactorRewrite);
        layoutBuilderAction.command = {
            command: 'extension.wrapWithLayoutBuilder',
            title: 'Wrap with LayoutBuilder',
            arguments: [document, range]
        };
        actions.push(layoutBuilderAction);

        const obxAction = new vscode.CodeAction('Wrap with Obx', vscode.CodeActionKind.RefactorRewrite);
        obxAction.command = {
            command: 'extension.wrapWithObx',
            title: 'Wrap with Obx',
            arguments: [document, range]
        };
        actions.push(obxAction);

        return actions;
    }
}

function wrapWidget(document: vscode.TextDocument, range: vscode.Range, wrapFunction: (widget: string) => string) {
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
    const wrappedText = wrapFunction(fullWidgetText);

    editor.edit(editBuilder => {
        editBuilder.replace(fullRange, wrappedText);
    });
}

function getFullWidgetRange(document: vscode.TextDocument, range: vscode.Range): vscode.Range | null {
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
        } else if (text[closeParenIndex] === ')') {
            openParenCount--;
        }
        closeParenIndex++;
    }

    if (openParenCount !== 0) {
        return null; // 没有找到匹配的右括号
    }

    return new vscode.Range(
        document.positionAt(widgetStart),
        document.positionAt(closeParenIndex)
    );
}

function wrapWithLayoutBuilder(widget: string): string {
    return `LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
            return ${widget.trim()};
        },
    )`;
}

function wrapWithObx(widget: string): string {
    return `Obx(() => ${widget.trim()})`;
}

export function deactivate() { }