import { exec, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { log } from './logger';

export class QuickActionsManager {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    registerCommands() {
        //快速build runner
        const buildRunnerQuickDisposable = vscode.commands.registerCommand('extension.buildRunnerQuick', (uri: vscode.Uri) => {
            this.buildRunnerQuick(uri);
        });

        //全量build runner
        const buildRunnerDisposable = vscode.commands.registerCommand('extension.buildRunner', () => {
            this.buildRunner();
        });

        //创建Getx Binding界面
        const createPageStructureDisposable = vscode.commands.registerCommand('extension.createGetxBindingPage', (uri: vscode.Uri) => {
            this.createPageStructure(uri);
        });

        //创建Getx 继承基类封装
        const createGetBasePageStructureDisposable = vscode.commands.registerCommand('extension.createGetxBasePage', (uri: vscode.Uri) => {
            this.createGetBasePageStructure(uri);
        });

        //生成iOS所有icon
        const generateAppIconsDisposable = vscode.commands.registerCommand('extension.generateIOSAppIcons', (uri: vscode.Uri) => {
            this.generateAppIcons(uri);
        });

        //将图片转成webp
        const compressToWebP = vscode.commands.registerCommand('extension.compressToWebP', this.compressToWebP.bind(this));

        // 生成 Assets
        const generateAssetsDisposable = vscode.commands.registerCommand('extension.generateAssets', () => {
            this.generateAssets();
        });

        this.context.subscriptions.push(buildRunnerQuickDisposable, buildRunnerDisposable, createPageStructureDisposable, createGetBasePageStructureDisposable, generateAppIconsDisposable, compressToWebP, generateAssetsDisposable);
    }

    private async buildRunnerQuick(uri: vscode.Uri) {
        const fsPath = uri.fsPath;
        const stats = await vscode.workspace.fs.stat(uri);
        const isDirectory = stats.type === vscode.FileType.Directory;
        if (!isDirectory && !fsPath.endsWith('.dart')) {
            vscode.window.showErrorMessage('Quick Build Runner only works with Dart files or directories.');
            return;
        }
        let tmpDir: string | undefined;
        try {
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('Unable to determine project root directory');
                return;
            }
            const projectRoot = workspaceFolder.uri.fsPath;
            tmpDir = isDirectory ? path.join(fsPath, '.tmp') : path.join(path.dirname(fsPath), '.tmp');
            try {
                await vscode.workspace.fs.delete(vscode.Uri.file(tmpDir), { recursive: true, useTrash: false });
            } catch (error) {
                // 如果目录不存在，忽略错误
            }
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
            await this.runBuildRunnerQuick(tmpDir, isDirectory);
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
            // 为偶尔误删除的 .g.dart 文件添加 git 恢复操作
            await new Promise((resolve, reject) => {
                const relativeTmpDir = path.relative(projectRoot, tmpDir!);
                const command = `git status --porcelain | grep '^ D .*\\.g\\.dart$' | while read -r line; do
                    file_path=$(echo "$line" | awk '{print $2}')
                    if [[ "$file_path" == *"${relativeTmpDir}"* ]]; then
                        git restore "$file_path"
                    fi
                done`;

                exec(command, { cwd: workspaceFolder?.uri.fsPath }, (error, stdout, stderr) => {
                    if (error && error.code !== 1) {
                        console.error(`Error during git restore: ${error}`);
                        reject(error);
                        return;
                    }
                    resolve(void 0);
                });
            });

            vscode.window.showInformationMessage('Quick Build Runner Completed Successfully');
        } catch (error) {
            log(`quickBuildRunner错误: ${error}`);
            vscode.window.showErrorMessage(`Error during Quick Build Runner: ${error}`);
        } finally {
            if (tmpDir) {
                try {
                    await vscode.workspace.fs.delete(vscode.Uri.file(tmpDir), { recursive: true });
                } catch (finallyError) {
                    log(`删除临时目录 ${tmpDir} 失败: ${finallyError}`);
                }
            }
        }
    }

    private async buildRunner() {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }
        const projectRoot = workspaceFolder.uri.fsPath;
        try {
            await this.runBuildRunnerCommand(projectRoot);
            // 为偶尔误删除的 .g.dart 文件添加 git 恢复操作
            await new Promise((resolve, reject) => {
                const command = `git status --porcelain | grep '^ D .*\\.g\\.dart$' | while read -r line; do
                    file_path=$(echo "$line" | awk '{print $2}')
                    git restore "$file_path"
                done`;

                exec(command, { cwd: workspaceFolder?.uri.fsPath }, (error, stdout, stderr) => {
                    if (error && error.code !== 1) { //当未找到匹配项时，grep 将返回 1，这对我们来说不是错误
                        console.error(`Error during git restore: ${error}`);
                        reject(error);
                        return;
                    }
                    resolve(void 0);
                });
            });
            vscode.window.showInformationMessage('Build Runner Completed Successfully');
        } catch (error) {
            vscode.window.showErrorMessage(`Error during Build Runner: ${error}`);
            log(`buildRunner错误: ${error}`);
        }
    }

    private async checkFvmExists(projectRoot: string): Promise<boolean> {
        return new Promise((resolve) => {
            // 检查项目目录下的 .fvmrc 文件是否存在
            const fvmrcPath = path.join(projectRoot, '.fvmrc');
            fs.access(fvmrcPath, fs.constants.F_OK, (err) => {
                resolve(!err); // 如果 .fvmrc 文件存在，则说明项目使用了 FVM
            });
        });
    }

    private async getBuildCommand(projectRoot: string): Promise<string> {
        const hasFvm = await this.checkFvmExists(projectRoot);
        log(`getBuildCommand 是否有FVM: ${hasFvm}`);
        return hasFvm ? 'fvm dart run build_runner build' : 'dart run build_runner build';
    }

    private async runBuildRunnerQuick(workingDir: string, isDirectory: boolean): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(workingDir));
            if (!workspaceFolder) {
                reject(new Error('Unable to determine project root directory'));
                return;
            }
            const projectRoot = workspaceFolder.uri.fsPath;
            const relativePath = path.relative(projectRoot, workingDir);
            const buildFilter = `${relativePath}/*`;
            const baseCommand = await this.getBuildCommand(projectRoot);
            const command = `${baseCommand} --delete-conflicting-outputs --build-filter=${buildFilter}`;
            exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
                if (error) {
                    log(`runBuildRunnerQuick错误: ${error}`);
                    reject(error);
                    return;
                }
                log(`runBuildRunnerQuick标准输出: ${stdout}`);
                resolve();
            });
        });
    }

    private async runBuildRunnerCommand(projectRoot: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const baseCommand = await this.getBuildCommand(projectRoot);
            const command = `${baseCommand} --delete-conflicting-outputs`;
            exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
                if (error) {
                    log(`runBuildRunnerCommand错误: ${error}`);
                    reject(error);
                    return;
                }
                log(`runBuildRunnerQuick标准输出: ${stdout}`);
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
            log(`createPageStructure错误: ${error}`);
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

    private generateLogicContent(pageName: string, stateFilePath: string): string {
        const className = this.toPascalCase(pageName);
        return `import '${stateFilePath}';
import 'package:go_router/go_router.dart';

/// 页面控制器，负责业务逻辑处理
class ${className}Controller extends BaseController {
  /// 路由状态，包含路由参数
  final GoRouterState? _routeState;

  /// 页面状态管理对象
  ${className}Controller(this._routeState);

  /// 当前controller的log
  static const String _logTag = '${className}Controller';  

  final states = ${className}State();

  @override
  void onInit() {
    super.onInit();
    _initRouteParams();
  }
  
  /// 初始化路由参数
  void _initRouteParams() {
    if (_routeState?.extra != null) {
      ALog.debug(_logTag, _routeState?.extra);
      // 解析路由参数
      final params = _routeState!.extra as Map?;
      // TODO: 处理路由参数
    }
  }

  @override
  void onReady() {
    super.onReady();
    // TODO: 页面准备完成后的初始化逻辑
  }

  @override
  void onClose() {
    // TODO: 添加控制器资源释放逻辑
    super.onClose();
  }
}
`;
    }

    private generateStateContent(pageName: string): string {
        const className = this.toPascalCase(pageName);
        return `
/// 页面状态管理对象
class ${className}State {
  ${className}State() {
    ///Initialize variables
  }
}
`;
    }


    private generateGetViewContent(pageName: string, controllerFilePath: string, stateFilePath: string): string {
        const className = this.toPascalCase(pageName);
        return `import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:go_router/go_router.dart';

import '${controllerFilePath}';
import '${stateFilePath}';

/// 页面视图，负责UI展示和用户交互
class ${className}View extends BasePage<${className}Controller> implements CommonHandler {
  /// 控制器标识符，用于GetX多实例控制器管理
  final String _tag;

  @override
  String get tag => _tag;

  /// 获取用于GetX的tag，如果tag为空字符串则返回null
  String? get _getXTag => tag.isEmpty ? null : tag;

  /// 从路由参数中获取tag值，如果没有则返回空字符串
  static String _getTagFromRoute(GoRouterState? routeState) {
    if (routeState?.extra is Map) {
      final extra = routeState!.extra as Map;
      return extra['tag']?.toString() ?? '';
    }
    return '';
  }
  
  /// 构造函数，自动处理控制器的初始化和注入
  ${className}View(GoRouterState? routeState, {super.key}) : _tag = _getTagFromRoute(routeState) {
    Get.put(${className}Controller(routeState), tag: _getXTag);
  }
  
  /// 自动处理控制器的销毁
  @override
  List<GetControllerRecycler> provideRecyclers() {
    return [GetControllerRecycler(run: () => Get.delete<${className}Controller>(tag: _getXTag))];
  }
  
  /// 获取控制器实例
  ${className}Controller get logic => Get.find<${className}Controller>(tag: _getXTag);

  /// 获取状态管理实例
  ${className}State get state => logic.states;

  @override
  PreferredSizeWidget createAppBar() {
    return createCommonAppBar(title: '消息');
  }
  
  @override
  List<Widget> createBody() {
    return [
      _buildContent(),
    ];
  }

  Widget _buildContent() {
    return const Center(
      child: Text(
        '内容区域',
      ),
    );
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
            onTap: () async {
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

    private async createGetBasePageStructure(uri: vscode.Uri) {
        const pageName = await vscode.window.showInputBox({
            prompt: "",
            placeHolder: "输入类名  eg: HomePage or homePage"
        });
        if (!pageName) {
            return;
        }
        const snakeCaseName = this.toSnakeCase(pageName);
        const pageDir = path.join(uri.fsPath, snakeCaseName);
        try {
            await vscode.workspace.fs.createDirectory(vscode.Uri.file(pageDir));
            const subDirs = ['controller', 'state', 'view', 'widget'];
            for (const dir of subDirs) {
                await vscode.workspace.fs.createDirectory(vscode.Uri.file(path.join(pageDir, dir)));
            }

            // const stateFilePath = `${vscode.Uri.file(pageDir)}/${snakeCaseName}/state/${snakeCaseName}_state.dart`;
            const stateFilePath = `../state/${snakeCaseName}_state.dart`;
            const controllerFilePath = `../controller/${snakeCaseName}_controller.dart`;

            const files = [
                { name: `${snakeCaseName}_controller.dart`, dir: 'controller', content: this.generateLogicContent(snakeCaseName, stateFilePath) },
                { name: `${snakeCaseName}_state.dart`, dir: 'state', content: this.generateStateContent(snakeCaseName) },
                { name: `${snakeCaseName}_view.dart`, dir: 'view', content: this.generateGetViewContent(snakeCaseName, controllerFilePath, stateFilePath) }
            ];
            for (const file of files) {
                const filePath = path.join(pageDir, file.dir, file.name);
                await vscode.workspace.fs.writeFile(vscode.Uri.file(filePath), Buffer.from(file.content));
            }
            vscode.window.showInformationMessage(`Get界面 for ${snakeCaseName} 创建完成.`);
        } catch (error) {
            log(`createGetBasePageStructure错误: ${error}`);
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
            log(`generateAppIcons: filePath = ${filePath}`);
            const dimensions = await this.getImageDimensions(filePath);
            if (dimensions.width !== 1024 || dimensions.height !== 1024) {
                vscode.window.showWarningMessage('The selected image is not 1024x1024.');
                return;
            }
            const scriptPath = path.join(this.context.extensionPath, 'scripts', 'generate_app_icons.sh');
            log(`generateAppIcons: scriptPath = ${scriptPath}`);
            exec(`sh "${scriptPath}" "${filePath}"`, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Error generating app icons: ${error.message}`);
                    log(`generateAppIcons: error = ${error.message}`);
                    return;
                }
                log(`generateAppIcons标准输出: ${stdout}`);
                vscode.window.showInformationMessage('iOS logo generated successfully');
            });
        } catch (error) {
            log(`generateAppIcons错误: ${error}`);
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

    private compressToWebP(uri: vscode.Uri) {
        if (uri && uri.fsPath) {
            const folderPath = uri.fsPath;
            const scriptPath = path.join(this.context.extensionPath, 'scripts', 'compress_to_webp.sh');
            if (fs.existsSync(scriptPath)) {
                try {
                    execSync(`bash "${scriptPath}" "${folderPath}"`, { stdio: 'inherit' });
                    vscode.window.showInformationMessage('Compressed to WebP successfully!');
                } catch (error) {
                    vscode.window.showErrorMessage('Failed to compress images to webp.');
                    log(`compressToWebP错误: ${error}`);
                }
            } else {
                vscode.window.showErrorMessage('compress_to_webp.sh script not found.');
            }
        } else {
            vscode.window.showErrorMessage('Please select a folder to compress images.');
        }
    }

    private async generateAssets() {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        try {
            const projectRoot = workspaceFolder.uri.fsPath;
            const genDir = path.join(projectRoot, 'lib', 'gen');

            try {
                await vscode.workspace.fs.stat(vscode.Uri.file(genDir));
            } catch {
                vscode.window.showErrorMessage('gen directory does not exist');
                return;
            }

            const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(genDir));
            for (const [file, type] of files) {
                if (type === vscode.FileType.File && file.endsWith('.gen.dart')) {
                    await vscode.workspace.fs.delete(vscode.Uri.file(path.join(genDir, file)));
                }
            }

            const baseCommand = await this.getBuildCommand(projectRoot);
            const command = `${baseCommand} --delete-conflicting-outputs --build-filter=lib/gen/*`;
            log(`${command}`);

            exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Error generating assets: ${error.message}`);
                    return;
                }
                vscode.window.showInformationMessage('Assets generated successfully');
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Error during assets generation: ${error}`);
        }
    }
}
