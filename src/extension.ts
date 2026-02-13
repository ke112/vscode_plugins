import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { FlutterWrapperManager } from './flutterWrapperManager';
import { logger } from './logger';
import { QuickActionsManager } from './quickActionsManager';
import { SnippetManager } from './snippetManager';

/**
 * 更新 Flutter 项目上下文变量
 * 用于控制菜单项的显示/隐藏
 */
async function updateFlutterProjectContext(): Promise<void> {
    const isFlutter = await QuickActionsManager.isFlutterProject();
    await vscode.commands.executeCommand('setContext', 'flutter-plugins.isFlutterProject', isFlutter);
    logger.log(`Flutter 项目检测: ${isFlutter}`);
}

export function activate(context: vscode.ExtensionContext) {
    logger.log('FNPlugin activated');
    const flutterWrapperManager = new FlutterWrapperManager();
    const quickActionsManager = new QuickActionsManager(context);
    const snippetManager = new SnippetManager();

    // 检测并设置 Flutter 项目上下文
    updateFlutterProjectContext();

    // 监听工作区变化，动态更新上下文
    const workspaceFoldersWatcher = vscode.workspace.onDidChangeWorkspaceFolders(() => {
        updateFlutterProjectContext();
    });
    context.subscriptions.push(workspaceFoldersWatcher);

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

    // ── 自动重载机制 ──
    // 打包脚本安装新版本后 touch ~/.flutter-plugins-zhangzhihua/.reload-trigger
    // 插件通过 fs.watchFile (polling) 检测到 mtime 变化，自动执行 Reload Window
    // 优势：不依赖键盘模拟、不依赖 URI Scheme、不受窗口焦点/输入法影响
    setupAutoReloadWatcher(context);
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
    constructor(private flutterWrapperManager: FlutterWrapperManager) { }

    public provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
        // 放宽条件，允许在更多情况下触发包裹组件功能
        // 不再严格要求必须通过重构菜单触发
        // 仅检查document是否是dart文件
        if (document.languageId !== 'dart') {
            return [];
        }

        // 检查是否有context.only，如果有，确保它包含重构类型
        if (context.only && !context.only.contains(vscode.CodeActionKind.Refactor)) {
            return [];
        }

        return this.flutterWrapperManager.provideCodeActions(document, range);
    }
}

export function deactivate() {
    logger.log('FNPlugin deactivated');
}

/**
 * 设置自动重载文件监听器
 * 打包脚本安装新版本后 touch ~/.flutter-plugins-zhangzhihua/.reload-trigger，
 * 插件检测到 mtime 变化后自动执行 workbench.action.reloadWindow
 */
function setupAutoReloadWatcher(context: vscode.ExtensionContext) {
    const RELOAD_TRIGGER_DIR = path.join(os.homedir(), '.flutter-plugins-zhangzhihua');
    const RELOAD_TRIGGER_FILE = path.join(RELOAD_TRIGGER_DIR, '.reload-trigger');
    const POLL_INTERVAL_MS = 2000;

    try {
        // 确保触发文件目录和文件存在
        if (!fs.existsSync(RELOAD_TRIGGER_DIR)) {
            fs.mkdirSync(RELOAD_TRIGGER_DIR, { recursive: true });
        }
        if (!fs.existsSync(RELOAD_TRIGGER_FILE)) {
            fs.writeFileSync(RELOAD_TRIGGER_FILE, '', 'utf-8');
        }

        // fs.watchFile 基于 stat polling，跨平台最可靠（不依赖 inotify/kqueue/FSEvents）
        fs.watchFile(RELOAD_TRIGGER_FILE, { interval: POLL_INTERVAL_MS }, (curr, prev) => {
            // 文件存在（mtimeMs > 0）且 mtime 发生变化时触发重载
            if (curr.mtimeMs > 0 && curr.mtimeMs !== prev.mtimeMs) {
                logger.log(`检测到 .reload-trigger 变化 (prev=${prev.mtimeMs}, curr=${curr.mtimeMs})，自动重载窗口...`);
                // 先停止监听，避免后台多次 touch 导致重复触发 reload
                fs.unwatchFile(RELOAD_TRIGGER_FILE);
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            }
        });

        // 扩展停用时清理 watcher
        context.subscriptions.push({
            dispose: () => {
                fs.unwatchFile(RELOAD_TRIGGER_FILE);
            }
        });

        logger.log(`自动重载监听已启动: ${RELOAD_TRIGGER_FILE}`);
    } catch (err) {
        // 非关键功能，失败不影响插件正常使用
        logger.log(`自动重载监听设置失败: ${err}`);
    }
}
