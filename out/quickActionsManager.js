"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickActionsManager = void 0;
const child_process_1 = require("child_process");
const path = require("path");
const vscode = require("vscode");
class QuickActionsManager {
    registerCommands(context) {
        const quickBuildRunnerDisposable = vscode.commands.registerCommand('extension.quickBuildRunner', (uri) => {
            this.quickBuildRunner(uri);
        });
        const buildRunnerDisposable = vscode.commands.registerCommand('extension.buildRunner', () => {
            this.buildRunner();
        });
        context.subscriptions.push(quickBuildRunnerDisposable, buildRunnerDisposable);
    }
    async quickBuildRunner(uri) {
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
            await vscode.workspace.fs.createDirectory(vscode.Uri.file(tmpDir));
            const originalDir = isDirectory ? fsPath : path.dirname(fsPath);
            if (isDirectory) {
                const files = await vscode.workspace.fs.readDirectory(uri);
                for (const [file, type] of files) {
                    if (type === vscode.FileType.File && file.endsWith('.dart') && !file.endsWith('.g.dart')) {
                        await vscode.workspace.fs.copy(vscode.Uri.file(path.join(originalDir, file)), vscode.Uri.file(path.join(tmpDir, file)));
                    }
                }
            }
            else {
                const originalFilename = path.basename(fsPath);
                await vscode.workspace.fs.copy(uri, vscode.Uri.file(path.join(tmpDir, originalFilename)));
            }
            await this.runBuildRunner(tmpDir, isDirectory);
            const tmpFiles = await vscode.workspace.fs.readDirectory(vscode.Uri.file(tmpDir));
            for (const [file, type] of tmpFiles) {
                if (type === vscode.FileType.File && file.endsWith('.g.dart')) {
                    const originalFile = path.join(originalDir, file);
                    const tmpFile = path.join(tmpDir, file);
                    await vscode.workspace.fs.copy(vscode.Uri.file(tmpFile), vscode.Uri.file(originalFile), { overwrite: true });
                }
            }
            await vscode.workspace.fs.delete(vscode.Uri.file(tmpDir), { recursive: true });
            vscode.window.showInformationMessage('Quick Build Runner completed successfully.');
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error during Quick Build Runner: ${error}`);
        }
    }
    async buildRunner() {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }
        vscode.window.showInformationMessage(`Start Build Runner`);
        const projectRoot = workspaceFolder.uri.fsPath;
        try {
            await this.runBuildRunnerCommand(projectRoot);
            vscode.window.showInformationMessage('Build Runner completed successfully.');
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error during Build Runner: ${error}`);
            console.error(`Error: ${error}`);
        }
    }
    runBuildRunner(workingDir, isDirectory) {
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
    async fileExists(filePath) {
        try {
            await vscode.workspace.fs.stat(vscode.Uri.file(filePath));
            return true;
        }
        catch {
            return false;
        }
    }
    async deleteGeneratedFiles(dir) {
        const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(dir));
        for (const [file, type] of files) {
            const filePath = path.join(dir, file);
            if (type === vscode.FileType.Directory) {
                await this.deleteGeneratedFiles(filePath);
            }
            else if (type === vscode.FileType.File && file.endsWith('.g.dart')) {
                await vscode.workspace.fs.delete(vscode.Uri.file(filePath));
                console.log(`Deleted: ${filePath}`);
            }
        }
    }
    runBuildRunnerCommand(projectRoot) {
        return new Promise((resolve, reject) => {
            const command = `dart run build_runner build --delete-conflicting-outputs`;
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
}
exports.QuickActionsManager = QuickActionsManager;
//# sourceMappingURL=quickActionsManager.js.map