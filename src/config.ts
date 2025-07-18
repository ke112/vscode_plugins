import * as vscode from 'vscode';

class ConfigManager {
    private static _instance: ConfigManager;
    private _excludedWidgets: Set<string>;

    private constructor() {
        this._excludedWidgets = this.loadExcludedWidgets();
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('fnplugin.flutter.excludedWidgets')) {
                this._excludedWidgets = this.loadExcludedWidgets();
            }
        });
    }

    public static get instance(): ConfigManager {
        if (!ConfigManager._instance) {
            ConfigManager._instance = new ConfigManager();
        }
        return ConfigManager._instance;
    }

    private loadExcludedWidgets(): Set<string> {
        const config = vscode.workspace.getConfiguration('fnplugin.flutter');
        const excluded = config.get<string[]>('excludedWidgets', []);
        return new Set(excluded);
    }

    public get excludedWidgets(): Set<string> {
        return this._excludedWidgets;
    }
}

export const configManager = ConfigManager.instance;

export const EXCLUDED_WIDGETS = new Set([
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
    'return',
    'const',
    'final',
    'var',
    'void',
    'async',
    'await',
    'late',
    'this',
    'super',
    'extends',
    'implements',
    'with',
    'as',
    'is',
    'on',
    'get',
    'set',
    'is',
    'has',
    'is',
    'has',
    'left',
    'right',
    'top',
    'bottom',
    'center',
    'start',
    'end',
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
    'topStart',
    'topEnd',
    'bottomStart',
    'bottomEnd',
    'ltr',
    'rtl',
    'textDirection',
    // 可以添加其他需要排除的基础 Widget 类型
]);