import * as vscode from 'vscode';
import { FlutterWrapperManager } from './flutterWrapperManager';
import { QuickActionsManager } from './quickActionsManager';
import { SnippetManager } from './snippetManager';

export function activate(context: vscode.ExtensionContext) {
    const flutterWrapperManager = new FlutterWrapperManager();
    const quickActionsManager = new QuickActionsManager();
    const snippetManager = new SnippetManager();

    // 注册flutter包裹组件命令
    flutterWrapperManager.registerCommands(context);

    // 注册快速操作命令
    quickActionsManager.registerCommands(context);

    // 注册代码片段命令和自动完成
    snippetManager.registerCommands(context);

    // 注册代码操作提供者
    const codeActionProvider = vscode.languages.registerCodeActionsProvider(
        { scheme: 'file', language: 'dart' },
        new FlutterWrapperActionProvider(flutterWrapperManager)
    );
    // 注册代码操作提供者
    context.subscriptions.push(codeActionProvider);
}

class FlutterWrapperActionProvider implements vscode.CodeActionProvider {
    constructor(private flutterWrapperManager: FlutterWrapperManager) { }
    // 提供代码操作
    provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] {
        return this.flutterWrapperManager.provideCodeActions(document, range);
    }
}

export function deactivate() { }
