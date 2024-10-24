import * as vscode from 'vscode';

export class FlutterWrapperManager {
    private wrappers: Map<string, (widget: string, indentation: string) => string> = new Map();

    constructor() {
        this.initializeWrappers();
    }

    private initializeWrappers() {
        //方法名按照字母顺序排列
        this.wrappers.set('AfterLayout', this.wrapWithAfterLayout);
        this.wrappers.set('AnnotatedRegion', this.wrapWithAnnotatedRegion);
        this.wrappers.set('AnimatedBuilder', this.wrapWithAnimatedBuilder);
        this.wrappers.set('ClipRRect', this.wrapWithClipRRect);
        this.wrappers.set('GestureDetector', this.wrapWithGestureDetector);
        this.wrappers.set('InkWell', this.wrapWithInkWell);
        this.wrappers.set('LayoutBuilder', this.wrapWithLayoutBuilder);
        this.wrappers.set('MeasureSize', this.wrapWithMeasureSize);
        this.wrappers.set('MediaQuery', this.wrapWithMediaQuery);
        this.wrappers.set('Obx', this.wrapWithObx);
        this.wrappers.set('PreferredSize', this.wrapWithPreferredSize);
        this.wrappers.set('Stack', this.wrapWithStack);
        this.wrappers.set('Theme', this.wrapWithTheme);
        this.wrappers.set('ValueListenableBuilder', this.wrapWithValueListenableBuilder);
        this.wrappers.set('ValueListenableListBuilder', this.wrapWithValueListenableListBuilder);
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
        const lineText = document.lineAt(range.start.line).text;
        const widgetName = this.extractWidgetName(lineText, range.start.character);

        if (this.isPotentialWidget(widgetName)) {
            this.wrappers.forEach((_, name) => {
                const action = new vscode.CodeAction(`Wrap with ${name}`, vscode.CodeActionKind.RefactorRewrite);
                action.command = {
                    command: `extension.wrapWith${name}`,
                    title: `Wrap with ${name}`,
                    arguments: [document, range]
                };
                actions.push(action);
            });
        }

        return actions;
    }

    private extractWidgetName(lineText: string, cursorPosition: number): string {
        // 从光标位置向前搜索可能的 Widget 名称或方法名
        const beforeCursor = lineText.slice(0, cursorPosition);
        const match = beforeCursor.match(/\b(_?[a-zA-Z][a-zA-Z0-9_]*)\s*$/);
        return match ? match[1] : '';
    }

    // 判断是否为潜在的 Widget 名称
    // 以下划线开头的名称，检查是否为小驼峰命名
    // 不以下划线开头的名称，检查是否为大驼峰命名
    private isPotentialWidget(name: string): boolean {
        // 暂时默认返回 true
        return true;
        if (name.startsWith('_')) {
            // 对于以下划线开头的名称，检查是否为小驼峰命名
            return /^_[a-z][a-zA-Z0-9]*$/.test(name) && name.length > 2;
        } else {
            // 对于不以下划线开头的名称，检查是否为大驼峰命名
            return /^[A-Z][a-zA-Z0-9]*$/.test(name) && name.length > 1;
        }
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

    private wrapWithAnnotatedRegion(widget: string, indentation: string): string {
        return `AnnotatedRegion<SystemUiOverlayStyle>(
${indentation}  value: const SystemUiOverlayStyle(
${indentation}    statusBarColor: Colors.transparent,
${indentation}    statusBarIconBrightness: Brightness.dark,
${indentation}  ),
${indentation}  child: ${widget.trim()},
${indentation})`;
    }

    private wrapWithAnimatedBuilder(widget: string, indentation: string): string {
        return `AnimatedBuilder(
${indentation}  animation: controller.animationController,
${indentation}  builder: (BuildContext context, Widget? child) {
${indentation}    //Opacity 透明度 opacity:_container.value,
${indentation}    //Transform.rotate 旋转 angle: controller.animation.value,
${indentation}    //Transform.translate 平移 Offset(0, 200 * controller.animation.value),
${indentation}    //Transform.scale 缩放  scale: _container.value,
${indentation}    //FadeTransition 透明度 opacity: _container,
${indentation}    //RotationTransition 旋转 turns: _container,
${indentation}    //SlideTransition 平移 position: _container.drive(Tween(begin: const Offset(0, 0), end: const Offset(0.5, 0.5))),
${indentation}    //ScaleTransition 缩放 scale: _container,
${indentation}    //SizeTransition 上下收缩 sizeFactor: _container,
${indentation}    //SliverFadeTransition 一组widget的透明组切换的效果
${indentation}    //PositionedTransition 绝对定位的动画实现, 需要Stack包裹
${indentation}    //RelativePositionedTransition 缩放动画
${indentation}    //DecoratedBoxTransition 修改decoration盒子动画
${indentation}    //AlignTransition 修改Alignment的相对位置动画
${indentation}    //DefaultTextStyleTransition 修改TextStyle的动画
${indentation}    return FadeTransition(
${indentation}      opacity: controller.animation,
${indentation}      child: ScaleTransition(
${indentation}        scale: controller.animation,
${indentation}        child: SlideTransition(
${indentation}          position: controller.animationController.drive(Tween(begin: const Offset(0, 0), end: const Offset(1, 1))),
${indentation}          child: RotationTransition(
${indentation}            turns: controller.animation,
${indentation}            //以上是隐士动画,以下是显示动画
${indentation}            child: Opacity(
${indentation}              opacity: controller.animationController.value,
${indentation}              child: Transform.scale(
${indentation}                scale: controller.animationController.value,
${indentation}                child: Transform.translate(
${indentation}                  offset: Offset(
${indentation}                      controller.animationController.value * 200, (controller.animationController.value) * 200),
${indentation}                  child: Transform.rotate(
${indentation}                    angle: controller.animationController.value * 2 * 3.14,
${indentation}                    child: child ?? const SizedBox.shrink(),
${indentation}                  ),
${indentation}                ),
${indentation}              ),
${indentation}            ),
${indentation}          ),
${indentation}        ),
${indentation}      ),
${indentation}    );
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

    private wrapWithInkWell(widget: string, indentation: string): string {
        return `InkWell(
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

    private wrapWithPreferredSize(widget: string, indentation: string): string {
        return `PreferredSize(
${indentation}  preferredSize: Size.fromHeight(55),
${indentation}  child: ${widget.trim()},
${indentation})`;
    }

    private wrapWithStack(widget: string, indentation: string): string {
        return `Stack(
${indentation}  children: [
${indentation}    ${widget.trim()},
${indentation}  ],
${indentation})`;
    }

    private wrapWithTheme(widget: string, indentation: string): string {
        return `Theme(
${indentation}  data: ThemeData(
${indentation}    brightness: Brightness.light,
${indentation}    splashColor: Colors.transparent,
${indentation}    highlightColor: Colors.transparent,
${indentation}  ),
${indentation}  child: ${widget.trim()},
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

    private wrapWithValueListenableListBuilder(widget: string, indentation: string): string {
        return `ValueListenableListBuilder(
${indentation}  valueListenables: [],
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
