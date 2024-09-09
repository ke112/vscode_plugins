import { exec } from 'child_process';
import * as path from 'path';
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

    const quickBuildRunnerDisposable = vscode.commands.registerCommand('extension.quickBuildRunner', (uri: vscode.Uri) => {
        quickBuildRunner(uri);
    });

    const buildRunnerDisposable = vscode.commands.registerCommand('extension.buildRunner', () => {
        buildRunner();
    });

    context.subscriptions.push(codeActionProvider, layoutBuilderDisposable, obxDisposable, gestureDetectorDisposable, valueListenableBuilderDisposable, mediaQueryDisposable, afterLayoutDisposable, measureSizeDisposable, visibilityDetectorDisposable, clipRRectDisposable, stackDisposable, quickBuildRunnerDisposable, buildRunnerDisposable);
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

function wrapWidget(document: vscode.TextDocument, range: vscode.Range, wrapFunction: (widget: string, indentation: string) => string) {
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
    const indentationMatch = document.lineAt(fullRange.start.line).text.match(/^\s*/);
    const indentation = indentationMatch ? indentationMatch[0] : '';
    const wrappedText = wrapFunction(fullWidgetText, indentation);

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

    // 检查右括号后是否有扩展方法
    while (closeParenIndex < text.length) {
        const char = text[closeParenIndex];
        if (char === '.') {
            // 找到扩展方法的结束位置
            let methodEnd = closeParenIndex + 1;
            while (methodEnd < text.length && /[a-zA-Z0-9_]/.test(text[methodEnd])) {
                methodEnd++;
            }
            if (methodEnd < text.length && text[methodEnd] === '(') {
                // 如果扩展方法后面跟着括号，继续查找匹配的右括号
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
                    return null; // 没有找到匹配的右括号
                }
            } else {
                closeParenIndex = methodEnd;
            }
        } else if (/\s/.test(char)) {
            // 跳过空白字符
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

function wrapWithLayoutBuilder(widget: string, indentation: string): string {
    return `LayoutBuilder(
${indentation}  builder: (BuildContext context, BoxConstraints constraints) {
${indentation}    return ${widget.trim()};
${indentation}  },
${indentation})`;
}

function wrapWithObx(widget: string, indentation: string): string {
    return `Obx(() => ${widget.trim()})`;
}

function wrapWithGestureDetector(widget: string, indentation: string): string {
    return `GestureDetector(
${indentation}  behavior: HitTestBehavior.translucent,
${indentation}  onTap: () {
${indentation}    //
${indentation}  },
${indentation}  child: ${widget.trim()},
${indentation})`;
}

function wrapWithValueListenableBuilder(widget: string, indentation: string): string {
    return `ValueListenableBuilder(
${indentation}  valueListenable: null,
${indentation}  builder: (context, value, child) {
${indentation}    return ${widget.trim()};
${indentation}  },
${indentation})`;
}

function wrapWithMediaQuery(widget: string, indentation: string): string {
    return `MediaQuery.removePadding(
${indentation}  context: context,
${indentation}  removeTop: true,
${indentation}  removeBottom: true,
${indentation}    child: ${widget.trim()},
${indentation})`;
}

function wrapWithAfterLayout(widget: string, indentation: string): string {
    return `AfterLayout(
${indentation}  callback: (RenderAfterLayout ral) {
${indentation}    // Add your callback logic here
${indentation}  },
${indentation}  child: ${widget.trim()},
${indentation})`;
}

function wrapWithMeasureSize(widget: string, indentation: string): string {
    return `MeasureSize(
${indentation}  onChange: (Size size) {
${indentation}    // Add your size change logic here
${indentation}  },
${indentation}  child: ${widget.trim()},
${indentation})`;
}

function wrapWithVisibilityDetector(widget: string, indentation: string): string {
    return `VisibilityDetector(
${indentation}  key: const Key('unique key'),
${indentation}  onVisibilityChanged: (VisibilityInfo info) {
${indentation}    // Add your visibility change logic here with info.visibleFraction
${indentation}  },
${indentation}  child: ${widget.trim()},
${indentation})`;
}

function wrapWithClipRRect(widget: string, indentation: string): string {
    return `ClipRRect(
${indentation}  // borderRadius: BorderRadius.circular(16.w),
${indentation}  borderRadius: BorderRadius.only(
${indentation}    topLeft: Radius.circular(16.w),
${indentation}    topRight: Radius.circular(16.w),
${indentation}  ),
${indentation}  child: ${widget.trim()},
${indentation})`;
}

function wrapWithStack(widget: string, indentation: string): string {
    return `Stack(
${indentation}  children: [
${indentation}    ${widget.trim()},
${indentation}  ],
${indentation})`;
}

async function quickBuildRunner(uri: vscode.Uri) {
    const fsPath = uri.fsPath;
    const stats = await vscode.workspace.fs.stat(uri);
    const isDirectory = stats.type === vscode.FileType.Directory;

    if (!isDirectory && !fsPath.endsWith('.dart')) {
        vscode.window.showErrorMessage('Quick Build Runner only works with Dart files or directories.');
        return;
    }

    try {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('Unable to determine project root directory');
            return;
        }

        vscode.window.showInformationMessage(`Start Quick Build Runner`);

        const projectRoot = workspaceFolder.uri.fsPath;
        const libDir = path.join(projectRoot, 'lib');
        const tmpDir = path.join(libDir, 'tmp');

        // 创建临时目录
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(tmpDir));

        const originalDir = isDirectory ? fsPath : path.dirname(fsPath);

        if (isDirectory) {
            // 处理目录
            const files = await vscode.workspace.fs.readDirectory(uri);
            for (const [file, type] of files) {
                if (type === vscode.FileType.File && file.endsWith('.dart') && !file.endsWith('.g.dart')) {
                    await vscode.workspace.fs.copy(
                        vscode.Uri.file(path.join(originalDir, file)),
                        vscode.Uri.file(path.join(tmpDir, file))
                    );
                }
            }
        } else {
            // 处理单个文件
            const originalFilename = path.basename(fsPath);
            await vscode.workspace.fs.copy(uri, vscode.Uri.file(path.join(tmpDir, originalFilename)));
        }

        await runBuildRunner(tmpDir, isDirectory);

        // 将生成的 .g.dart 文件复制回原始目录
        const tmpFiles = await vscode.workspace.fs.readDirectory(vscode.Uri.file(tmpDir));
        for (const [file, type] of tmpFiles) {
            if (type === vscode.FileType.File && file.endsWith('.g.dart')) {
                const originalFile = path.join(originalDir, file);
                const tmpFile = path.join(tmpDir, file);
                await vscode.workspace.fs.copy(
                    vscode.Uri.file(tmpFile),
                    vscode.Uri.file(originalFile),
                    { overwrite: true }
                );
            }
        }

        // 清理临时目录
        await vscode.workspace.fs.delete(vscode.Uri.file(tmpDir), { recursive: true });

        vscode.window.showInformationMessage('Quick Build Runner completed successfully.');
    } catch (error) {
        vscode.window.showErrorMessage(`Error during Quick Build Runner: ${error}`);
    }
}

function runBuildRunner(workingDir: string, isDirectory: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(workingDir));
        if (!workspaceFolder) {
            reject(new Error('Unable to determine project root directory'));
            return;
        }

        const projectRoot = workspaceFolder.uri.fsPath;
        const relativePath = path.relative(projectRoot, workingDir);
        const buildFilter = `${relativePath}/*`;

        const command = `dart run build_runner build --delete-conflicting-outputs --build-filter=${buildFilter}`;
        // console.log(`Executing command: ${command} in directory: ${projectRoot}`);
        // vscode.window.showInformationMessage(`Executing command: ${command} in directory: ${projectRoot}`);
        exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
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

async function fileExists(filePath: string): Promise<boolean> {
    try {
        await vscode.workspace.fs.stat(vscode.Uri.file(filePath));
        return true;
    } catch {
        return false;
    }
}

async function buildRunner(): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder found');
        return;
    }

    vscode.window.showInformationMessage(`Start Build Runner`);

    const projectRoot = workspaceFolder.uri.fsPath;

    try {
        // 删除所有 .g.dart 文件
        // await deleteGeneratedFiles(projectRoot);

        // 执行 build_runner 命令
        await runBuildRunnerCommand(projectRoot);

        vscode.window.showInformationMessage('Build Runner completed successfully.');
    } catch (error) {
        vscode.window.showErrorMessage(`Error during Build Runner: ${error}`);
        console.error(`Error: ${error}`);
    }
}

async function deleteGeneratedFiles(dir: string): Promise<void> {
    const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(dir));
    for (const [file, type] of files) {
        const filePath = path.join(dir, file);
        if (type === vscode.FileType.Directory) {
            await deleteGeneratedFiles(filePath);
        } else if (type === vscode.FileType.File && file.endsWith('.g.dart')) {
            await vscode.workspace.fs.delete(vscode.Uri.file(filePath));
            console.log(`Deleted: ${filePath}`);
        }
    }
}

function runBuildRunnerCommand(projectRoot: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const command = 'dart run build_runner build --delete-conflicting-outputs';
        // vscode.window.showInformationMessage(`Executing command: ${command} in directory: ${projectRoot}`);

        exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            resolve();
        });
    });
}

export function deactivate() { }