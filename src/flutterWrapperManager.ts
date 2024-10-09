import * as vscode from 'vscode';

export class FlutterWrapperManager {
    private wrappers: Map<string, (widget: string, indentation: string) => string> = new Map();

    constructor() {
        this.initializeWrappers();
    }

    private initializeWrappers() {
        //方法名按照字母顺序排列
        this.wrappers.set('AfterLayout', this.wrapWithAfterLayout);
        this.wrappers.set('ClipRRect', this.wrapWithClipRRect);
        this.wrappers.set('GestureDetector', this.wrapWithGestureDetector);
        this.wrappers.set('LayoutBuilder', this.wrapWithLayoutBuilder);
        this.wrappers.set('MeasureSize', this.wrapWithMeasureSize);
        this.wrappers.set('MediaQuery', this.wrapWithMediaQuery);
        this.wrappers.set('Obx', this.wrapWithObx);
        this.wrappers.set('Stack', this.wrapWithStack);
        this.wrappers.set('ValueListenableBuilder', this.wrapWithValueListenableBuilder);
        this.wrappers.set('VisibilityDetector', this.wrapWithVisibilityDetector);
    }

    registerCommands(context: vscode.ExtensionContext) {
        this.wrappers.forEach((wrapper, name) => {
            const disposable = vscode.commands.registerCommand(`extension.wrapWith${name}`, (document: vscode.TextDocument, range: vscode.Range) => {
                this.wrapWidget(document, range, wrapper);
            });
            context.subscriptions.push(disposable);
        });
    }

    provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] {
        const actions: vscode.CodeAction[] = [];

        this.wrappers.forEach((_, name) => {
            const action = new vscode.CodeAction(`Wrap with ${name}`, vscode.CodeActionKind.RefactorRewrite);
            action.command = {
                command: `extension.wrapWith${name}`,
                title: `Wrap with ${name}`,
                arguments: [document, range]
            };
            actions.push(action);
        });

        return actions;
    }

    private wrapWidget(document: vscode.TextDocument, range: vscode.Range, wrapFunction: (widget: string, indentation: string) => string) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const fullRange = this.getFullWidgetRange(document, range);
        if (!fullRange) {
            vscode.window.showErrorMessage('Unable to determine widget boundaries');
            return;
        }

        const fullWidgetText = document.getText(fullRange);
        const indentationMatch = document.lineAt(fullRange.start.line).text.match(/^\s*/);
        const indentation = indentationMatch ? indentationMatch[0] : '';
        const wrappedText = wrapFunction(fullWidgetText, indentation);

        editor.edit(editBuilder => {
            editBuilder.replace(fullRange, wrappedText);
        });
    }

    private getFullWidgetRange(document: vscode.TextDocument, range: vscode.Range): vscode.Range | null {
        const text = document.getText();
        const startIndex = document.offsetAt(range.start);
        const endIndex = document.offsetAt(range.end);

        let widgetStart = startIndex;
        while (widgetStart > 0 && /[a-zA-Z]/.test(text[widgetStart - 1])) {
            widgetStart--;
        }

        // 检查是否有 'const' 修饰,一起带走
        const constKeyword = 'const ';
        if (widgetStart >= constKeyword.length &&
            text.substring(widgetStart - constKeyword.length, widgetStart) === constKeyword) {
            widgetStart -= constKeyword.length;
        }

        let openParenIndex = endIndex;
        while (openParenIndex < text.length && text[openParenIndex] !== '(') {
            openParenIndex++;
        }

        if (openParenIndex === text.length) {
            return null;
        }

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
            return null;
        }

        while (closeParenIndex < text.length) {
            const char = text[closeParenIndex];
            if (char === '.') {
                let methodEnd = closeParenIndex + 1;
                while (methodEnd < text.length && /[a-zA-Z0-9_]/.test(text[methodEnd])) {
                    methodEnd++;
                }
                if (methodEnd < text.length && text[methodEnd] === '(') {
                    openParenCount = 1;
                    closeParenIndex = methodEnd + 1;
                    while (closeParenIndex < text.length && openParenCount > 0) {
                        if (text[closeParenIndex] === '(') {
                            openParenCount++;
                        } else if (text[closeParenIndex] === ')') {
                            openParenCount--;
                        }
                        closeParenIndex++;
                    }
                    if (openParenCount !== 0) {
                        return null;
                    }
                } else {
                    closeParenIndex = methodEnd;
                }
            } else if (/\s/.test(char)) {
                closeParenIndex++;
            } else {
                break;
            }
        }

        return new vscode.Range(
            document.positionAt(widgetStart),
            document.positionAt(closeParenIndex)
        );
    }

    private wrapWithAfterLayout(widget: string, indentation: string): string {
        return `AfterLayout(
${indentation}  callback: (RenderAfterLayout ral) {
${indentation}    // ral.size;
${indentation}  },
${indentation}  child: ${widget.trim()},
${indentation})`;
    }

    private wrapWithClipRRect(widget: string, indentation: string): string {
        return `ClipRRect(
${indentation}  // borderRadius: BorderRadius.circular(16.w),
${indentation}  borderRadius: BorderRadius.only(
${indentation}    topLeft: Radius.circular(16.w),
${indentation}    topRight: Radius.circular(16.w),
${indentation}  ),
${indentation}  child: ${widget.trim()},
${indentation})`;
    }

    private wrapWithGestureDetector(widget: string, indentation: string): string {
        return `GestureDetector(
${indentation}  behavior: HitTestBehavior.translucent,
${indentation}  onTap: () async {
${indentation}    //
${indentation}  },
${indentation}  child: ${widget.trim()},
${indentation})`;
    }

    private wrapWithLayoutBuilder(widget: string, indentation: string): string {
        return `LayoutBuilder(
${indentation}  builder: (BuildContext context, BoxConstraints constraints) {
${indentation}    return ${widget.trim()};
${indentation}  },
${indentation})`;
    }

    private wrapWithMeasureSize(widget: string, indentation: string): string {
        return `MeasureSize(
${indentation}  onChange: (Size size) {
${indentation}    // Add your size change logic here
${indentation}  },
${indentation}  child: ${widget.trim()},
${indentation})`;
    }

    private wrapWithMediaQuery(widget: string, indentation: string): string {
        return `MediaQuery.removePadding(
${indentation}  context: context,
${indentation}  removeTop: true,
${indentation}  removeBottom: true,
${indentation}  child: ${widget.trim()},
${indentation})`;
    }

    private wrapWithObx(widget: string, indentation: string): string {
        return `Obx(() {
${indentation}  return ${widget.trim()};
${indentation}})`;
    }

    private wrapWithStack(widget: string, indentation: string): string {
        return `Stack(
${indentation}  children: [
${indentation}    ${widget.trim()},
${indentation}  ],
${indentation})`;
    }

    private wrapWithValueListenableBuilder(widget: string, indentation: string): string {
        return `ValueListenableBuilder(
${indentation}  valueListenable: null,
${indentation}  builder: (context, value, child) {
${indentation}    return ${widget.trim()};
${indentation}  },
${indentation})`;
    }

    private wrapWithVisibilityDetector(widget: string, indentation: string): string {
        return `VisibilityDetector(
${indentation}  key: const Key('unique key'),
${indentation}  onVisibilityChanged: (VisibilityInfo info) {
${indentation}    // double value = info.visibleFraction;
${indentation}  },
${indentation}  child: ${widget.trim()},
${indentation})`;
    }
}