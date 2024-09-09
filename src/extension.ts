import * as vscode from 'vscode';
import { FlutterWrapperManager } from './flutterWrapperManager';
import { QuickActionsManager } from './quickActionsManager';

export function activate(context: vscode.ExtensionContext) {
    const flutterWrapperManager = new FlutterWrapperManager();
    const quickActionsManager = new QuickActionsManager();

    // Register Flutter wrapper commands
    flutterWrapperManager.registerCommands(context);

    // Register quick actions commands
    quickActionsManager.registerCommands(context);

    // Register code action provider
    const codeActionProvider = vscode.languages.registerCodeActionsProvider(
        { scheme: 'file', language: 'dart' },
        new FlutterWrapperActionProvider(flutterWrapperManager)
    );

    context.subscriptions.push(codeActionProvider);
}

class FlutterWrapperActionProvider implements vscode.CodeActionProvider {
    constructor(private flutterWrapperManager: FlutterWrapperManager) { }

    provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] {
        return this.flutterWrapperManager.provideCodeActions(document, range);
    }
}

export function deactivate() { }