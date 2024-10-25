import { exec } from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';

export class QuickActionsManager {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    registerCommands() {
        const buildRunnerQuickDisposable = vscode.commands.registerCommand('extension.buildRunnerQuick', (uri: vscode.Uri) => {
            this.buildRunnerQuick(uri);
        });

        const buildRunnerDisposable = vscode.commands.registerCommand('extension.buildRunner', () => {
            this.buildRunner();
        });

        const createPageStructureDisposable = vscode.commands.registerCommand('extension.createGetxBindingPage', (uri: vscode.Uri) => {
            this.createPageStructure(uri);
        });

        const createCustomPageStructureDisposable = vscode.commands.registerCommand('extension.createGetxBindingCustomPage', (uri: vscode.Uri) => {
            this.createCustomPageStructure(uri);
        });

        const generateAppIconsDisposable = vscode.commands.registerCommand('extension.generateAppIcons', (uri: vscode.Uri) => {
            this.generateAppIcons(uri);
        });

        this.context.subscriptions.push(buildRunnerQuickDisposable, buildRunnerDisposable, createPageStructureDisposable, createCustomPageStructureDisposable, generateAppIconsDisposable);
    }

    private async buildRunnerQuick(uri: vscode.Uri) {
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

            // 修改 tmpDir 的位置
            const tmpDir = isDirectory ? path.join(fsPath, '.tmp') : path.join(path.dirname(fsPath), '.tmp');

            await vscode.workspace.fs.createDirectory(vscode.Uri.file(tmpDir));

            const originalDir = isDirectory ? fsPath : path.dirname(fsPath);

            if (isDirectory) {
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
                const originalFilename = path.basename(fsPath);
                await vscode.workspace.fs.copy(uri, vscode.Uri.file(path.join(tmpDir, originalFilename)));
            }

            await this.runBuildRunner(tmpDir, isDirectory);

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

            await vscode.workspace.fs.delete(vscode.Uri.file(tmpDir), { recursive: true });

            vscode.window.showInformationMessage('Quick Build Runner completed successfully.');
        } catch (error) {
            vscode.window.showErrorMessage(`Error during Quick Build Runner: ${error}`);
        }
    }

    private async buildRunner() {
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
        } catch (error) {
            vscode.window.showErrorMessage(`Error during Build Runner: ${error}`);
            console.error(`Error: ${error}`);
        }
    }

    private runBuildRunner(workingDir: string, isDirectory: boolean): Promise<void> {
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

    private runBuildRunnerCommand(projectRoot: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const command = `dart run build_runner build --delete-conflicting-outputs`;
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

    private async createPageStructure(uri: vscode.Uri) {
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
        } catch (error) {
            vscode.window.showErrorMessage(`Error creating page structure: ${error}`);
        }
    }

    private toSnakeCase(str: string): string {
        return str
            .replace(/([A-Z])/g, letter => `_${letter.toLowerCase()}`)
            .replace(/^_/, '') // 移除开头的下划线
            .toLowerCase();
    }

    private generateBindingContent(pageName: string): string {
        const className = this.toPascalCase(pageName);
        return `import 'package:get/get.dart';

//Convert absolute paths yourself
import '../controllers/${pageName}_controller.dart';

class ${className}Binding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<${className}Controller>(() => ${className}Controller());
  }
}
`;
    }

    private generateControllerContent(pageName: string): string {
        const className = this.toPascalCase(pageName);
        return `import 'package:get/get.dart';

class ${className}Controller extends GetxController {
  @override
  void onInit() {
    super.onInit();
    //
  }

  @override
  void onReady() {
    super.onReady();
    //
  }

  @override
  void onClose() {
    super.onClose();
    //
  }
}
`;
    }

    private generateViewContent(pageName: string): string {
        const className = this.toPascalCase(pageName);
        return `import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';

//Convert absolute paths yourself
import '../controllers/${pageName}_controller.dart';

class ${className}View extends GetView<${className}Controller> {
  const ${className}View({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          '${className}Title',
          style: TextStyle(
            fontSize: 16.sp,
            fontFamily: 'PingFang SC',
            fontWeight: FontWeight.w600,
            color: const Color(0xFF000818),
            height: 1.3,
          ),
        ),
        centerTitle: true,
        elevation: 0,
        leading: Builder(builder: (context) {
          return GestureDetector(
            behavior: HitTestBehavior.translucent,
            onTap: () {
              Navigator.maybeOf(context)?.pop();
            },
            child: const Icon(Icons.arrow_back_ios_new, color: Colors.black),
          );
        }),
      ),
      body: Container(),
    );
  }
}
`;
    }

    private toPascalCase(str: string): string {
        return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    }

    private async createCustomPageStructure(uri: vscode.Uri) {
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
                { name: `${snakeCaseName}_view.dart`, dir: 'views', content: this.generateCustomViewContent(snakeCaseName) }
            ];

            for (const file of files) {
                const filePath = path.join(pageDir, file.dir, file.name);
                await vscode.workspace.fs.writeFile(vscode.Uri.file(filePath), Buffer.from(file.content));
            }

            vscode.window.showInformationMessage(`Custom page structure for ${snakeCaseName} created successfully.`);
        } catch (error) {
            vscode.window.showErrorMessage(`Error creating custom page structure: ${error}`);
        }
    }

    private generateCustomViewContent(pageName: string): string {
        const className = this.toPascalCase(pageName);
        return `import 'package:flutter/material.dart';
//Introduce the BasePage path yourself
//Convert absolute paths yourself
import '../controllers/${pageName}_controller.dart';

class ${className}View extends BasePage<${className}Controller> {
  const ${className}View({super.key});

  @override
  List<Widget> createBody() {
    return [];
  }

  @override
  AppBar createAppBar() {
    return createCommonAppBar(title: '');
  }
}
`;
    }

    private async generateAppIcons(uri: vscode.Uri) {
        if (!uri) {
            vscode.window.showErrorMessage('Please select a PNG file.');
            return;
        }

        const filePath = uri.fsPath;
        if (!filePath.toLowerCase().endsWith('.png')) {
            vscode.window.showErrorMessage('The selected file is not a PNG image.');
            return;
        }

        try {
            const dimensions = await this.getImageDimensions(filePath);
            if (dimensions.width !== 1024 || dimensions.height !== 1024) {
                vscode.window.showWarningMessage('The selected image is not 1024x1024. The result may not be optimal.');
                return;
            }

            const scriptPath = path.join(this.context.extensionPath, 'scripts', 'generate_app_icons.sh');

            exec(`bash "${scriptPath}" "${filePath}"`, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Error generating app icons: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                }
                vscode.window.showInformationMessage('App icons generated successfully.');
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Error processing image: ${error}`);
        }
    }

    private getImageDimensions(filePath: string): Promise<{ width: number, height: number }> {
        return new Promise((resolve, reject) => {
            const sizeOf = require('image-size');
            sizeOf(filePath, (error: Error, dimensions: { width: number, height: number }) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(dimensions);
                }
            });
        });
    }
}
