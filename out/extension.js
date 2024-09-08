"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const child_process_1 = require("child_process");
const path = require("path");
const vscode = require("vscode");
function activate(context) {
    const codeActionProvider = vscode.languages.registerCodeActionsProvider({ scheme: 'file', language: 'dart' }, new FlutterWrapperActionProvider());
    const layoutBuilderDisposable = vscode.commands.registerCommand('extension.wrapWithLayoutBuilder', (document, range) => {
        wrapWidget(document, range, wrapWithLayoutBuilder);
    });
    const obxDisposable = vscode.commands.registerCommand('extension.wrapWithObx', (document, range) => {
        wrapWidget(document, range, wrapWithObx);
    });
    const gestureDetectorDisposable = vscode.commands.registerCommand('extension.wrapWithGestureDetector', (document, range) => {
        wrapWidget(document, range, wrapWithGestureDetector);
    });
    const valueListenableBuilderDisposable = vscode.commands.registerCommand('extension.wrapWithValueListenableBuilder', (document, range) => {
        wrapWidget(document, range, wrapWithValueListenableBuilder);
    });
    const mediaQueryDisposable = vscode.commands.registerCommand('extension.wrapWithMediaQuery', (document, range) => {
        wrapWidget(document, range, wrapWithMediaQuery);
    });
    const afterLayoutDisposable = vscode.commands.registerCommand('extension.wrapWithAfterLayout', (document, range) => {
        wrapWidget(document, range, wrapWithAfterLayout);
    });
    const measureSizeDisposable = vscode.commands.registerCommand('extension.wrapWithMeasureSize', (document, range) => {
        wrapWidget(document, range, wrapWithMeasureSize);
    });
    const visibilityDetectorDisposable = vscode.commands.registerCommand('extension.wrapWithVisibilityDetector', (document, range) => {
        wrapWidget(document, range, wrapWithVisibilityDetector);
    });
    const clipRRectDisposable = vscode.commands.registerCommand('extension.wrapWithClipRRect', (document, range) => {
        wrapWidget(document, range, wrapWithClipRRect);
    });
    const stackDisposable = vscode.commands.registerCommand('extension.wrapWithStack', (document, range) => {
        wrapWidget(document, range, wrapWithStack);
    });
    const quickBuildRunnerDisposable = vscode.commands.registerCommand('extension.quickBuildRunner', (uri) => {
        quickBuildRunner(uri);
    });
    context.subscriptions.push(codeActionProvider, layoutBuilderDisposable, obxDisposable, gestureDetectorDisposable, valueListenableBuilderDisposable, mediaQueryDisposable, afterLayoutDisposable, measureSizeDisposable, visibilityDetectorDisposable, clipRRectDisposable, stackDisposable, quickBuildRunnerDisposable);
}
exports.activate = activate;
class FlutterWrapperActionProvider {
    provideCodeActions(document, range) {
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
function wrapWidget(document, range, wrapFunction) {
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
function wrapWithObx(widget) {
    return `Obx(() => ${widget.trim()})`;
}
function wrapWithGestureDetector(widget) {
    return `GestureDetector(
        behavior: HitTestBehavior.translucent,
        onTap: () {
          //
        },
        child: ${widget.trim()},
    )`;
}
function wrapWithValueListenableBuilder(widget) {
    return `ValueListenableBuilder(
        valueListenable: null,
        builder: (context, value, child) {
            return ${widget.trim()};
      },
    )`;
}
function wrapWithMediaQuery(widget) {
    return `MediaQuery.removePadding(
      context: context,
      removeTop: true,
      removeBottom: true,
        child: ${widget.trim()},
    )`;
}
function wrapWithAfterLayout(widget) {
    return `AfterLayout(
      callback: (RenderAfterLayout ral) {
        // Add your callback logic here
      },
      child: ${widget.trim()},
    )`;
}
function wrapWithMeasureSize(widget) {
    return `MeasureSize(
      onChange: (Size size) {
        // Add your size change logic here
      },
      child: ${widget.trim()},
    )`;
}
function wrapWithVisibilityDetector(widget) {
    return `VisibilityDetector(
      key: const Key('unique key'),
      onVisibilityChanged: (VisibilityInfo info) {
        // Add your visibility change logic here with info.visibleFraction
      },
      child: ${widget.trim()},
    )`;
}
function wrapWithClipRRect(widget) {
    return `ClipRRect(
      // borderRadius: BorderRadius.circular(16.w),
      borderRadius: BorderRadius.only(
        topLeft: Radius.circular(16.w),
        topRight: Radius.circular(16.w),
      ),
      child: ${widget.trim()},
    )`;
}
function wrapWithStack(widget) {
    return `Stack(
      children: [
        ${widget.trim()},
      ],
    )`;
}
async function quickBuildRunner(uri) {
    const fsPath = uri.fsPath;
    const stats = await vscode.workspace.fs.stat(uri);
    const isDirectory = stats.type === vscode.FileType.Directory;
    if (!isDirectory && !fsPath.endsWith('.dart')) {
        vscode.window.showErrorMessage('Quick Build Runner only works with Dart files or directories.');
        return;
    }
    try {
        if (isDirectory) {
            // 处理目录
            await runBuildRunner(fsPath, true);
        }
        else {
            // 处理单个文件
            const originalDir = path.dirname(fsPath);
            const originalFilename = path.basename(fsPath);
            const tmpDir = path.join(originalDir, 'tmp');
            // 创建临时目录
            await vscode.workspace.fs.createDirectory(vscode.Uri.file(tmpDir));
            // 复制原始文件到临时目录
            await vscode.workspace.fs.copy(uri, vscode.Uri.file(path.join(tmpDir, originalFilename)));
            await runBuildRunner(tmpDir, false);
            // 将生成的 .g.dart 文件复制回原始目录
            const generatedFile = `${path.parse(originalFilename).name}.g.dart`;
            const generatedFilePath = path.join(tmpDir, generatedFile);
            if (await fileExists(generatedFilePath)) {
                console.log(`Copying generated file to: ${path.join(originalDir, generatedFile)}`);
                await vscode.workspace.fs.copy(vscode.Uri.file(generatedFilePath), vscode.Uri.file(path.join(originalDir, generatedFile)), { overwrite: true });
            }
            // 清理临时目录
            await vscode.workspace.fs.delete(vscode.Uri.file(tmpDir), { recursive: true });
        }
        vscode.window.showInformationMessage('Quick Build Runner completed successfully.');
    }
    catch (error) {
        vscode.window.showErrorMessage(`Error during Quick Build Runner: ${error}`);
    }
}
function runBuildRunner(workingDir, isDirectory) {
    return new Promise((resolve, reject) => {
        // 获取项目根目录
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(workingDir));
        if (!workspaceFolder) {
            reject(new Error('Unable to determine project root directory'));
            return;
        }
        const projectRoot = workspaceFolder.uri.fsPath;
        // 计算相对路径作为 build-filter
        const relativePath = path.relative(projectRoot, workingDir);
        const buildFilter = `${relativePath}/*`;
        const command = `dart run build_runner build --delete-conflicting-outputs --build-filter=${buildFilter}`;
        console.log(`Executing command: ${command} in directory: ${projectRoot}`);
        vscode.window.showInformationMessage(`Executing command: ${command} in directory: ${projectRoot}`);
        (0, child_process_1.exec)(command, { cwd: projectRoot }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                reject(error);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            resolve();
        });
    });
}
async function fileExists(filePath) {
    try {
        await vscode.workspace.fs.stat(vscode.Uri.file(filePath));
        return true;
    }
    catch {
        return false;
    }
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map