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

    const gestureDetectorDisposable = vscode.commands.registerCommand('extension.wrapWithGestureDetector', (document: vscode.TextDocument, range: vscode.Range) => {
        wrapWidget(document, range, wrapWithGestureDetector);
    });

    const valueListenableBuilderDisposable = vscode.commands.registerCommand('extension.wrapWithValueListenableBuilder', (document: vscode.TextDocument, range: vscode.Range) => {
        wrapWidget(document, range, wrapWithValueListenableBuilder);
    });

    const mediaQueryDisposable = vscode.commands.registerCommand('extension.wrapWithMediaQuery', (document: vscode.TextDocument, range: vscode.Range) => {
        wrapWidget(document, range, wrapWithMediaQuery);
    });

    const afterLayoutDisposable = vscode.commands.registerCommand('extension.wrapWithAfterLayout', (document: vscode.TextDocument, range: vscode.Range) => {
        wrapWidget(document, range, wrapWithAfterLayout);
    });

    const measureSizeDisposable = vscode.commands.registerCommand('extension.wrapWithMeasureSize', (document: vscode.TextDocument, range: vscode.Range) => {
        wrapWidget(document, range, wrapWithMeasureSize);
    });

    const visibilityDetectorDisposable = vscode.commands.registerCommand('extension.wrapWithVisibilityDetector', (document: vscode.TextDocument, range: vscode.Range) => {
        wrapWidget(document, range, wrapWithVisibilityDetector);
    });

    const clipRRectDisposable = vscode.commands.registerCommand('extension.wrapWithClipRRect', (document: vscode.TextDocument, range: vscode.Range) => {
        wrapWidget(document, range, wrapWithClipRRect);
    });

    const stackDisposable = vscode.commands.registerCommand('extension.wrapWithStack', (document: vscode.TextDocument, range: vscode.Range) => {
        wrapWidget(document, range, wrapWithStack);
    });

    context.subscriptions.push(codeActionProvider, layoutBuilderDisposable, obxDisposable, gestureDetectorDisposable, valueListenableBuilderDisposable, mediaQueryDisposable, afterLayoutDisposable, measureSizeDisposable, visibilityDetectorDisposable, clipRRectDisposable, stackDisposable);
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

        const gestureDetectorAction = new vscode.CodeAction('Wrap with GestureDetector', vscode.CodeActionKind.RefactorRewrite);
        gestureDetectorAction.command = {
            command: 'extension.wrapWithGestureDetector',
            title: 'Wrap with GestureDetector',
            arguments: [document, range]
        };
        actions.push(gestureDetectorAction);

        const valueListenableBuilderAction = new vscode.CodeAction('Wrap with ValueListenableBuilder', vscode.CodeActionKind.RefactorRewrite);
        valueListenableBuilderAction.command = {
            command: 'extension.wrapWithValueListenableBuilder',
            title: 'Wrap with ValueListenableBuilder',
            arguments: [document, range]
        };
        actions.push(valueListenableBuilderAction);

        const mediaQueryAction = new vscode.CodeAction('Wrap with MediaQuery', vscode.CodeActionKind.RefactorRewrite);
        mediaQueryAction.command = {
            command: 'extension.wrapWithMediaQuery',
            title: 'Wrap with MediaQuery',
            arguments: [document, range]
        };
        actions.push(mediaQueryAction);

        const afterLayoutAction = new vscode.CodeAction('Wrap with AfterLayout', vscode.CodeActionKind.RefactorRewrite);
        afterLayoutAction.command = {
            command: 'extension.wrapWithAfterLayout',
            title: 'Wrap with AfterLayout',
            arguments: [document, range]
        };
        actions.push(afterLayoutAction);

        const measureSizeAction = new vscode.CodeAction('Wrap with MeasureSize', vscode.CodeActionKind.RefactorRewrite);
        measureSizeAction.command = {
            command: 'extension.wrapWithMeasureSize',
            title: 'Wrap with MeasureSize',
            arguments: [document, range]
        };
        actions.push(measureSizeAction);

        const visibilityDetectorAction = new vscode.CodeAction('Wrap with VisibilityDetector', vscode.CodeActionKind.RefactorRewrite);
        visibilityDetectorAction.command = {
            command: 'extension.wrapWithVisibilityDetector',
            title: 'Wrap with VisibilityDetector',
            arguments: [document, range]
        };
        actions.push(visibilityDetectorAction);

        const clipRRectAction = new vscode.CodeAction('Wrap with ClipRRect', vscode.CodeActionKind.RefactorRewrite);
        clipRRectAction.command = {
            command: 'extension.wrapWithClipRRect',
            title: 'Wrap with ClipRRect',
            arguments: [document, range]
        };
        actions.push(clipRRectAction);

        const stackAction = new vscode.CodeAction('Wrap with Stack', vscode.CodeActionKind.RefactorRewrite);
        stackAction.command = {
            command: 'extension.wrapWithStack',
            title: 'Wrap with Stack',
            arguments: [document, range]
        };
        actions.push(stackAction);

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

function wrapWithGestureDetector(widget: string): string {
    return `GestureDetector(
        behavior: HitTestBehavior.translucent,
        onTap: () {
          //
        },
        child: ${widget.trim()},
    )`;
}

function wrapWithValueListenableBuilder(widget: string): string {
    return `ValueListenableBuilder(
        valueListenable: null,
        builder: (context, value, child) {
            return ${widget.trim()};
      },
    )`;
}

function wrapWithMediaQuery(widget: string): string {
    return `MediaQuery.removePadding(
      context: context,
      removeTop: true,
      removeBottom: true,
        child: ${widget.trim()},
    )`;
}

function wrapWithAfterLayout(widget: string): string {
    return `AfterLayout(
      callback: (RenderAfterLayout ral) {
        // Add your callback logic here
      },
      child: ${widget.trim()},
    )`;
}

function wrapWithMeasureSize(widget: string): string {
    return `MeasureSize(
      onChange: (Size size) {
        // Add your size change logic here
      },
      child: ${widget.trim()},
    )`;
}

function wrapWithVisibilityDetector(widget: string): string {
    return `VisibilityDetector(
      key: const Key('unique key'),
      onVisibilityChanged: (VisibilityInfo info) {
        // Add your visibility change logic here with info.visibleFraction
      },
      child: ${widget.trim()},
    )`;
}

function wrapWithClipRRect(widget: string): string {
    return `ClipRRect(
      // borderRadius: BorderRadius.circular(16.w),
      borderRadius: BorderRadius.only(
        topLeft: Radius.circular(16.w),
        topRight: Radius.circular(16.w),
      ),
      child: ${widget.trim()},
    )`;
}

function wrapWithStack(widget: string): string {
    return `Stack(
      children: [
        ${widget.trim()},
      ],
    )`;
}

export function deactivate() { }