"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const flutterWrapperManager_1 = require("./flutterWrapperManager");
const quickActionsManager_1 = require("./quickActionsManager");
function activate(context) {
    const flutterWrapperManager = new flutterWrapperManager_1.FlutterWrapperManager();
    const quickActionsManager = new quickActionsManager_1.QuickActionsManager();
    // Register Flutter wrapper commands
    flutterWrapperManager.registerCommands(context);
    // Register quick actions commands
    quickActionsManager.registerCommands(context);
    // Register code action provider
    const codeActionProvider = vscode.languages.registerCodeActionsProvider({ scheme: 'file', language: 'dart' }, new FlutterWrapperActionProvider(flutterWrapperManager));
    context.subscriptions.push(codeActionProvider);
}
exports.activate = activate;
class FlutterWrapperActionProvider {
    constructor(flutterWrapperManager) {
        this.flutterWrapperManager = flutterWrapperManager;
    }
    provideCodeActions(document, range) {
        return this.flutterWrapperManager.provideCodeActions(document, range);
    }
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map