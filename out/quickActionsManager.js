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
        const createPageStructureDisposable = vscode.commands.registerCommand('extension.createGetxBindingPage', (uri) => {
            this.createPageStructure(uri);
        });
        context.subscriptions.push(quickBuildRunnerDisposable, buildRunnerDisposable, createPageStructureDisposable);
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
    async createPageStructure(uri) {
        const pageName = await vscode.window.showInputBox({
            prompt: "Enter the page name",
            placeHolder: "e.g. HomePage or homePage"
        });
        if (!pageName) {
            return;
        }
        const snakeCaseName = this.toSnakeCase(pageName);
        const pageDir = path.join(uri.fsPath, snakeCaseName);
        try {
            await vscode.workspace.fs.createDirectory(vscode.Uri.file(pageDir));
            const subDirs = ['bindings', 'views', 'controllers', 'widgets'];
            for (const dir of subDirs) {
                await vscode.workspace.fs.createDirectory(vscode.Uri.file(path.join(pageDir, dir)));
            }
            const files = [
                { name: `${snakeCaseName}_binding.dart`, dir: 'bindings', content: this.generateBindingContent(snakeCaseName) },
                { name: `${snakeCaseName}_controller.dart`, dir: 'controllers', content: this.generateControllerContent(snakeCaseName) },
                { name: `${snakeCaseName}_view.dart`, dir: 'views', content: this.generateViewContent(snakeCaseName) }
            ];
            for (const file of files) {
                const filePath = path.join(pageDir, file.dir, file.name);
                await vscode.workspace.fs.writeFile(vscode.Uri.file(filePath), Buffer.from(file.content));
            }
            vscode.window.showInformationMessage(`Page structure for ${snakeCaseName} created successfully.`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error creating page structure: ${error}`);
        }
    }
    toSnakeCase(str) {
        return str
            .replace(/([A-Z])/g, letter => `_${letter.toLowerCase()}`)
            .replace(/^_/, '') // 移除开头的下划线
            .toLowerCase();
    }
    generateBindingContent(pageName) {
        const className = this.toPascalCase(pageName);
        return `import 'package:get/get.dart';
import '../controllers/${pageName}_controller.dart';

class ${className}Binding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<${className}Controller>(() => ${className}Controller());
  }
}
`;
    }
    generateControllerContent(pageName) {
        const className = this.toPascalCase(pageName);
        return `import 'package:get/get.dart';

class ${className}Controller extends GetxController {
  // TODO: Implement ${className}Controller

  final count = 0.obs;

  void increment() => count.value++;
}
`;
    }
    generateViewContent(pageName) {
        const className = this.toPascalCase(pageName);
        return `import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/${pageName}_controller.dart';

class ${className}View extends GetView<${className}Controller> {
  const ${className}View({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${className}'),
        centerTitle: true,
      ),
      body: Center(
        child: Obx(
          () => Text(
            'Clicks: \${controller.count}',
            style: TextStyle(fontSize: 20),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add),
        onPressed: controller.increment,
      ),
    );
  }
}
`;
    }
    toPascalCase(str) {
        return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    }
}
exports.QuickActionsManager = QuickActionsManager;
//# sourceMappingURL=quickActionsManager.js.map