import * as vscode from 'vscode';
import { FlutterWrapperManager } from './flutterWrapperManager';
import { QuickActionsManager } from './quickActionsManager';
import { SnippetManager } from './snippetManager';

export function activate(context: vscode.ExtensionContext) {
    const flutterWrapperManager = new FlutterWrapperManager();
    const quickActionsManager = new QuickActionsManager(context);
    const snippetManager = new SnippetManager();

    // 注册flutter包裹组件命令
    flutterWrapperManager.registerCommands(context);

    // 注册快速操作命令
    quickActionsManager.registerCommands();

    // 注册代码片段命令
    snippetManager.registerCommands(context);

    // 注册代码操作提供者
    const codeActionProvider = vscode.languages.registerCodeActionsProvider(
        { scheme: 'file', language: 'dart' },
        new FlutterWrapperActionProvider(flutterWrapperManager)
    );
    // 注册代码操作提供者
    context.subscriptions.push(codeActionProvider);

    // 注册清理
    context.subscriptions.push({
        dispose: () => snippetManager.dispose()
    });
}

// 添加节流函数
function throttle<T extends (...args: any[]) => any>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout | null = null;
    let previous = 0;

    // 使用箭头函数来保持 this 的上下文
    return ((...args: Parameters<T>) => {
        const now = Date.now();
        const remaining = wait - (now - previous);

        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            return func(...args);
        } else if (!timeout) {
            timeout = setTimeout(() => {
                previous = Date.now();
                timeout = null;
                func(...args);
            }, remaining);
        }
    }) as T;
}

class FlutterWrapperActionProvider implements vscode.CodeActionProvider {
    private throttledProvideCodeActions: Function;

    constructor(private flutterWrapperManager: FlutterWrapperManager) {
        this.throttledProvideCodeActions = throttle(this._provideCodeActions.bind(this), 500);
    }

    public provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
        // 更严格的判断：
        // 1. 必须是通过重构菜单触发
        // 2. 检查触发源是否为重构操作
        if (!context.triggerKind || context.triggerKind !== vscode.CodeActionTriggerKind.Invoke) {
            return [];
        }

        // 如果有 context.only，还需要确保它包含重构类型
        if (context.only && !context.only.contains(vscode.CodeActionKind.Refactor)) {
            return [];
        }

        return this.throttledProvideCodeActions(document, range, context, token);
    }

    private _provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
        return this.flutterWrapperManager.provideCodeActions(document, range);
    }
}

export function deactivate() { }
