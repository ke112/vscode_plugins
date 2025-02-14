import * as vscode from 'vscode';
import { log } from './logger';

export class FlutterWrapperManager {
    private wrappers: Map<string, (widget: string, indentation: string) => string> = new Map();
    private cachedCodeActions: Map<string, vscode.CodeAction[]> = new Map();
    private lastCacheCleanTime: number = Date.now();
    private readonly CACHE_CLEANUP_INTERVAL = 1000 * 60 * 5; // 5分钟清理一次缓存
    private readonly EXCLUDED_WIDGETS = new Set([
        'StatelessWidget',
        'StatefulWidget',
        'Widget',
        'BuildContext',
        'NeverScrollableScrollPhysics',
        'EdgeInsets',
        'Axis',
        'Size',
        'Colors',
        'Get',
        // 可以添加其他需要排除的基础 Widget 类型
    ]);

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
        const lineText = document.lineAt(range.start.line).text;
        const widgetName = this.extractWidgetName(lineText, range.start.character);

        // 确保 widgetName 不为空, 
        // >50 为过滤选择全部文件时的响应, 正常2~50足够
        if (!widgetName || widgetName.length < 2 || widgetName.length > 50) {
            return [];
        }

        // 检查 widgetName 前面的字符是否为点号(. <)
        const widgetIndex = lineText.indexOf(widgetName);
        if (widgetIndex > 0 && lineText[widgetIndex - 1] === '.' ||
            widgetIndex > 0 && lineText[widgetIndex - 1] === '<'
        ) {
            log(`已排除前边是.的情况`);
            return [];
        }

        // 检查是否为方法声明
        const trimmedLeft = lineText.substring(0, range.start.character).trimLeft();
        if (trimmedLeft.startsWith('void ') || trimmedLeft.startsWith('async ')) {
            log(`已排除前边是void 的情况`);
            return [];
        }

        // 确保 widgetName 是完整的字符串匹配
        if (this.EXCLUDED_WIDGETS.has(widgetName)) {
            log('已排除预先排除组件:', widgetName);
            return [];
        } else {
            log('不是预先排除的组件:', widgetName);
        }

        // 检查缓存
        const cacheKey = `${widgetName}`;
        const cachedActions = this.cachedCodeActions.get(cacheKey);
        if (cachedActions) {
            return this.updateCachedActionArguments(cachedActions, document, range);
        }

        // 清理过期缓存
        this.cleanupCacheIfNeeded();

        // 如果不是潜在的 Widget，直接返回空数组
        if (!this.isPotentialWidget(widgetName)) {
            return [];
        }

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

        // 缓存结果
        this.cachedCodeActions.set(cacheKey, actions);

        return actions;
    }

    private updateCachedActionArguments(
        cachedActions: vscode.CodeAction[],
        document: vscode.TextDocument,
        range: vscode.Range
    ): vscode.CodeAction[] {
        return cachedActions.map(action => {
            const newAction = new vscode.CodeAction(
                action.title!,
                action.kind
            );
            newAction.command = {
                ...action.command!,
                arguments: [document, range]
            };
            return newAction;
        });
    }

    private cleanupCacheIfNeeded() {
        const now = Date.now();
        if (now - this.lastCacheCleanTime > this.CACHE_CLEANUP_INTERVAL) {
            this.cachedCodeActions.clear();
            this.lastCacheCleanTime = now;
        }
    }

    private extractWidgetName(lineText: string, cursorPosition: number): string {
        // 获取选中的文本范围
        const editor = vscode.window.activeTextEditor;
        if (editor && !editor.selection.isEmpty) {
            const selectedText = editor.document.getText(editor.selection).trim();
            return selectedText;
        }

        // 如果没有选中文本，则从光标位置前后提取
        const beforeCursor = lineText.slice(0, cursorPosition);
        const afterCursor = lineText.slice(cursorPosition);

        // 向前匹配到单词开始
        const beforeMatch = beforeCursor.match(/\b(_?[a-zA-Z][a-zA-Z0-9_]*)$/);
        const beforePart = beforeMatch ? beforeMatch[1] : '';

        // 向后匹配到空格、左括号或小数点
        const afterMatch = afterCursor.match(/^([a-zA-Z0-9_]*?)(?=[\s(.]|$)/);
        const afterPart = afterMatch ? afterMatch[1] : '';

        const extractedName = beforePart + afterPart;
        return extractedName;
    }

    private isPotentialWidget(name: string): boolean {
        return true;
        // 快速检查常见的非 widget 情况
        const nonWidgetPrefixes = ['on', 'get', 'set', 'is', 'has'];
        if (nonWidgetPrefixes.some(prefix => name.toLowerCase().startsWith(prefix))) {
            log('名称包含非小部件前缀:', name);
            return false;
        }

        // 排除非大写开头的名称
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
            log('名称不符合 Widget 命名规范:', name);
            return false;
        }

        // 通过所有检查，认为是潜在的 Widget
        return true;
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
        while (widgetStart > 0 && /[a-zA-Z_]/.test(text[widgetStart - 1])) {
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
${indentation}    //
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
${indentation}  preferredSize: Size.fromHeight(55.w),
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
${indentation}  key: ValueKey(''),
${indentation}  onVisibilityChanged: (VisibilityInfo info) {
${indentation}    double value = info.visibleFraction;
${indentation}  },
${indentation}  child: ${widget.trim()},
${indentation})`;
    }
}
