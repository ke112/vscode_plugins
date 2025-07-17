import * as vscode from 'vscode';

class Logger {
    private static _instance: Logger;
    private readonly _outputChannel: vscode.OutputChannel;
    private _enabled: boolean = true;

    private constructor() {
        this._outputChannel = vscode.window.createOutputChannel('FNPlugin');
        this.updateConfiguration();
        vscode.workspace.onDidChangeConfiguration(() => this.updateConfiguration());
    }

    public static get instance(): Logger {
        if (!Logger._instance) {
            Logger._instance = new Logger();
        }
        return Logger._instance;
    }

    private updateConfiguration() {
        const config = vscode.workspace.getConfiguration('fnplugin');
        this._enabled = config.get<boolean>('logging.enabled', true);
    }

    public log(...args: any[]) {
        if (!this._enabled) {
            return;
        }
        const prefix = '[FNPlugin]';
        const message = args.map(arg => {
            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg, null, 2);
                } catch (e) {
                    return '[Unserializable object]';
                }
            }
            return String(arg);
        }).join(' ');

        this._outputChannel.appendLine(`${prefix} [${new Date().toISOString()}] ${message}`);
        // Also log to the developer tools console
        console.log(prefix, ...args);
    }

    public show() {
        this._outputChannel.show();
    }

    public dispose() {
        this._outputChannel.dispose();
    }
}

export const logger = Logger.instance;