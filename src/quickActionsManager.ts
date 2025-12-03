import { exec, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { logger } from './logger';

export class QuickActionsManager {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    /**
     * 检测当前工作区是否是 Flutter 项目
     * 判断标准：pubspec.yaml 存在且包含 flutter: 配置节（行首无缩进）
     */
    static async isFlutterProject(): Promise<boolean> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            logger.log('isFlutterProject: 没有工作区文件夹');
            return false;
        }
        const pubspecPath = path.join(workspaceFolder.uri.fsPath, 'pubspec.yaml');
        logger.log(`isFlutterProject: 检查路径 ${pubspecPath}`);
        try {
            const content = await vscode.workspace.fs.readFile(vscode.Uri.file(pubspecPath));
            const text = Buffer.from(content).toString('utf-8');
            // 检查是否包含 flutter: 配置节（Flutter 项目特征）
            // 匹配行首的 flutter:（无缩进），后面跟换行或空格
            const isFlutter = /^flutter\s*:/m.test(text);
            logger.log(`isFlutterProject: 检测结果 ${isFlutter}`);
            return isFlutter;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.log(`isFlutterProject: 读取 pubspec.yaml 失败 - ${errorMessage}`);
            return false;
        }
    }

    /**
     * 检查是否是 Flutter 项目，非 Flutter 项目时抛出错误
     */
    private async checkFlutterProjectOrThrow(): Promise<void> {
        const isFlutter = await QuickActionsManager.isFlutterProject();
        if (!isFlutter) {
            throw new Error('此命令仅适用于 Flutter 项目');
        }
    }

    registerCommands() {
        //快速build runner
        const buildRunnerQuickDisposable = vscode.commands.registerCommand('extension.buildRunnerQuick', async (uri: vscode.Uri) => {
            try {
                await this.checkFlutterProjectOrThrow();
                vscode.window.showInformationMessage('🔄 正在快速执行 Build Runner...');
                await this.buildRunnerQuick(uri);
                vscode.window.showInformationMessage('✅ Quick Build Runner Completed Successfully');
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                logger.log(`Quick Build Runner 失败: ${errorMessage}`);
                vscode.window.showErrorMessage('❌ Quick Build Runner 失败');
            }
        });

        //全量build runner
        const buildRunnerDisposable = vscode.commands.registerCommand('extension.buildRunner', async () => {
            try {
                await this.checkFlutterProjectOrThrow();
                vscode.window.showInformationMessage('🔄 正在执行全量 Build Runner...');
                await this.buildRunner();
                vscode.window.showInformationMessage('✅ Build Runner Completed Successfully');
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                logger.log(`Build Runner 失败: ${errorMessage}`);
                vscode.window.showErrorMessage('❌ Build Runner 失败');
            }
        });

        //创建Getx Binding界面
        const createPageStructureDisposable = vscode.commands.registerCommand('extension.createGetxBindingPage', async (uri: vscode.Uri) => {
            try {
                await this.checkFlutterProjectOrThrow();
                vscode.window.showInformationMessage('🔄 正在创建 Getx Binding 页面结构...');
                await this.createPageStructure(uri);
                vscode.window.showInformationMessage('✅ Getx Binding 页面结构创建成功');
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                logger.log(`创建 Getx Binding 页面结构失败: ${errorMessage}`);
                vscode.window.showErrorMessage('❌ 创建 Getx Binding 页面结构失败');
            }
        });

        //创建Getx 继承基类封装
        const createGetBasePageStructureDisposable = vscode.commands.registerCommand('extension.createGetxBasePage', async (uri: vscode.Uri) => {
            try {
                await this.checkFlutterProjectOrThrow();
                vscode.window.showInformationMessage('🔄 正在创建 Getx 基类页面结构...');
                await this.createGetBasePageStructure(uri);
                vscode.window.showInformationMessage('✅ Getx 基类页面结构创建成功');
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                logger.log(`创建 Getx 基类页面结构失败: ${errorMessage}`);
                vscode.window.showErrorMessage('❌ 创建 Getx 基类页面结构失败');
            }
        });

        //生成iOS所有icon
        const generateAppIconsDisposable = vscode.commands.registerCommand('extension.generateIOSAppIcons', async (uri: vscode.Uri) => {
            try {
                await this.checkFlutterProjectOrThrow();
                vscode.window.showInformationMessage('🔄 正在生成 iOS App Icons...');
                await this.generateAppIcons(uri);
                vscode.window.showInformationMessage('✅ iOS logo 生成成功');
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                logger.log(`iOS logo 生成失败: ${errorMessage}`);
                vscode.window.showErrorMessage('❌ iOS logo 生成失败');
            }
        });

        //将图片转成webp
        const compressToWebP = vscode.commands.registerCommand('extension.compressToWebP', async (uri: vscode.Uri) => {
            try {
                await this.checkFlutterProjectOrThrow();
                vscode.window.showInformationMessage('🔄 正在压缩图片为 WebP...');
                await this.compressToWebP(uri);
                vscode.window.showInformationMessage('✅ 图片已成功压缩为 WebP');
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                logger.log(`图片压缩为 WebP 失败: ${errorMessage}`);
                vscode.window.showErrorMessage('❌ 图片压缩为 WebP 失败');
            }
        });

        // 生成 Assets
        const generateAssetsDisposable = vscode.commands.registerCommand('extension.generateAssets', async () => {
            try {
                await this.checkFlutterProjectOrThrow();
                vscode.window.showInformationMessage('🔄 正在生成 Assets...');
                await this.generateAssets();
                vscode.window.showInformationMessage('✅ Assets 生成完成');
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                logger.log(`Assets 生成失败: ${errorMessage}`);
                vscode.window.showErrorMessage('❌ Assets 生成失败');
            }
        });

        this.context.subscriptions.push(buildRunnerQuickDisposable, buildRunnerDisposable, createPageStructureDisposable, createGetBasePageStructureDisposable, generateAppIconsDisposable, compressToWebP, generateAssetsDisposable);
    }

    private async buildRunnerQuick(uri: vscode.Uri) {
        const fsPath = uri.fsPath;
        const stats = await vscode.workspace.fs.stat(uri);
        const isDirectory = stats.type === vscode.FileType.Directory;
        if (!isDirectory && !fsPath.endsWith('.dart')) {
            throw new Error('Quick Build Runner only works with Dart files or directories.');
        }
        let tmpDir: string | undefined;
        try {
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
            if (!workspaceFolder) {
                throw new Error('Unable to determine project root directory');
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

            // 在运行 build_runner 之前，删除临时目录中可能存在的旧 .g.dart 文件
            const tmpFilesInDir = await vscode.workspace.fs.readDirectory(vscode.Uri.file(tmpDir));
            for (const [file, type] of tmpFilesInDir) {
                if (type === vscode.FileType.File && file.endsWith('.g.dart')) {
                    await vscode.workspace.fs.delete(vscode.Uri.file(path.join(tmpDir, file)));
                }
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
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.log(`quickBuildRunner错误: ${errorMessage}`);
            throw error;
        } finally {
            if (tmpDir) {
                try {
                    await vscode.workspace.fs.delete(vscode.Uri.file(tmpDir), { recursive: true });
                } catch (finallyError) {
                    const errorMessage = finallyError instanceof Error ? finallyError.message : String(finallyError);
                    logger.log(`删除临时目录 ${tmpDir} 失败: ${errorMessage}`);
                }
            }
        }
    }

    private async buildRunner() {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }
        const projectRoot = workspaceFolder.uri.fsPath;
        try {
            // 1. 删除所有 .g.dart 文件
            logger.log('开始删除所有 .g.dart 文件...');
            await this.deleteAllGeneratedFiles(projectRoot);
            logger.log('已删除所有 .g.dart 文件');

            // 2. 执行 build_runner clean
            logger.log('执行 build_runner clean...');
            await this.runBuildRunnerClean(projectRoot);
            logger.log('build_runner clean 完成');

            // 3. 执行 build_runner build --delete-conflicting-outputs
            logger.log('执行 build_runner build...');
            await this.runBuildRunnerCommand(projectRoot);
            logger.log('build_runner build 完成');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.log(`buildRunner错误: ${errorMessage}`);
            throw error;
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
        logger.log(`getBuildCommand 是否有FVM: ${hasFvm}`);
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
            const buildFilter = `${relativePath}/**`;
            const baseCommand = await this.getBuildCommand(projectRoot);
            const command = `${baseCommand} --build-filter="${buildFilter}" --delete-conflicting-outputs`;
            logger.log(`runBuildRunnerQuick 命令: ${command}`);
            exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
                if (error) {
                    logger.log(`runBuildRunnerQuick错误: ${error}`);
                    reject(error);
                    return;
                }
                logger.log(`runBuildRunnerQuick标准输出: ${stdout}`);
                resolve();
            });
        });
    }

    private async runBuildRunnerCommand(projectRoot: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const baseCommand = await this.getBuildCommand(projectRoot);
            const command = `${baseCommand} --delete-conflicting-outputs`;
            logger.log(`runBuildRunnerCommand 命令: ${command}`);
            exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
                if (error) {
                    logger.log(`runBuildRunnerCommand错误: ${error}`);
                    reject(error);
                    return;
                }
                logger.log(`runBuildRunnerCommand标准输出: ${stdout}`);
                resolve();
            });
        });
    }

    private async runBuildRunnerClean(projectRoot: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const hasFvm = await this.checkFvmExists(projectRoot);
            const command = hasFvm ? 'fvm dart run build_runner clean' : 'dart run build_runner clean';
            logger.log(`runBuildRunnerClean 命令: ${command}`);
            exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
                if (error) {
                    logger.log(`runBuildRunnerClean错误: ${error}`);
                    reject(error);
                    return;
                }
                logger.log(`runBuildRunnerClean标准输出: ${stdout}`);
                resolve();
            });
        });
    }

    /**
     * 递归删除项目中所有 .g.dart 文件
     * 实现类似 shell 命令: find . -name "*.g.dart" -type f -delete
     */
    private async deleteAllGeneratedFiles(dirPath: string): Promise<void> {
        const dirUri = vscode.Uri.file(dirPath);
        let entries: [string, vscode.FileType][];
        
        try {
            entries = await vscode.workspace.fs.readDirectory(dirUri);
        } catch {
            return; // 目录不存在或无法访问，跳过
        }

        for (const [name, type] of entries) {
            const fullPath = path.join(dirPath, name);

            // 跳过隐藏目录和常见的不需要扫描的目录
            if (name.startsWith('.') || name === 'build' || name === 'ios' || name === 'android' || name === 'web' || name === 'macos' || name === 'linux' || name === 'windows') {
                continue;
            }

            if (type === vscode.FileType.Directory) {
                // 递归处理子目录
                await this.deleteAllGeneratedFiles(fullPath);
            } else if (type === vscode.FileType.File && name.endsWith('.g.dart')) {
                // 删除 .g.dart 文件
                try {
                    await vscode.workspace.fs.delete(vscode.Uri.file(fullPath));
                    logger.log(`已删除文件: ${fullPath}`);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    logger.log(`删除文件失败 ${fullPath}: ${errorMessage}`);
                }
            }
        }
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
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.log(`createPageStructure错误: ${errorMessage}`);
            throw error;
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

class ${className}Controller extends BaseController {
  final GoRouterState? _routeState;
  ${className}Controller(this._routeState);
  static const String _logTag = '${className}Controller';  
  
  @override
  final ${className}State state = ${className}State();

  @override
  void onInit() {
    super.onInit();
    _initRouteParams();
  }
  
  void _initRouteParams() {
    if (_routeState?.extra != null) {
      final params = _routeState!.extra as Map?;
      if (params != null) {
        // 处理路由参数
      }
    }
  }

  @override
  void onClose() {
    pageState.dispose();
    super.onClose();
  }
}
`;
    }

    private generateStateContent(pageName: string): string {
        const className = this.toPascalCase(pageName);
        return `class ${className}State {
  ${className}State() {
    //
  }

  void dispose() {
    //
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
import 'package:skywork_client/src/common/page/base_page.dart';

class ${className}View extends BasePage<${className}Controller> with CommonHandler {
  /// 构造函数,接收路由传参 state
  ${className}View(GoRouterState extra, {super.key}) {
    if (!Get.isRegistered<${className}Controller>()) {
      Get.put(${className}Controller(extra));
    }
  }

  @override
  List<GetControllerRecycler> provideRecyclers() {
    return [GetControllerRecycler(run: () => Get.delete<${className}Controller>())];
  }

  ${className}State get state => controller.state;

  @override
  PreferredSizeWidget createAppBar() {
    return createCommonAppBar(title: '标题');
  }
  
  @override
  List<Widget> createBody() {
    return [
      GetBuilder<${className}Controller>(
        builder: (_) {
          return _buildContent();
        },
      )
    ];
  }

  Widget _buildContent() {
    return Container(
      padding: EdgeInsetsDirectional.all(16),
      child: const Center(child: Text('内容区域')),
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
    return Directionality(
      textDirection: Directionality.of(context),
      child: Scaffold(
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
              child: const Icon(Icons.arrow_back, color: Colors.black),
            );
          }),
        ),
        body: Container(
          padding: EdgeInsetsDirectional.all(16.w),
          child: const Text('Content goes here'),
        ),
      ),
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
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.log(`createGetBasePageStructure错误: ${errorMessage}`);
            throw error;
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

    private async generateAppIcons(uri: vscode.Uri): Promise<void> {
        if (!uri) {
            throw new Error('Please select a PNG file.');
        }
        const filePath = uri.fsPath;
        if (!filePath.toLowerCase().endsWith('.png')) {
            throw new Error('The selected file is not a PNG image.');
        }
        logger.log(`generateAppIcons: filePath = ${filePath}`);
        const dimensions = await this.getImageDimensions(filePath);
        if (dimensions.width !== 1024 || dimensions.height !== 1024) {
            throw new Error('The selected image is not 1024x1024.');
        }
        const scriptPath = path.join(this.context.extensionPath, 'scripts', 'generate_app_icons.sh');
        logger.log(`generateAppIcons: scriptPath = ${scriptPath}`);
        
        return new Promise((resolve, reject) => {
            exec(`sh "${scriptPath}" "${filePath}"`, (error, stdout, stderr) => {
                if (error) {
                    logger.log(`generateAppIcons错误: ${error.message}`);
                    reject(error);
                    return;
                }
                logger.log(`generateAppIcons标准输出: ${stdout}`);
                resolve();
            });
        });
    }

    private getImageDimensions(filePath: string): Promise<{ width: number, height: number }> {
        return new Promise((resolve, reject) => {
            try {
                const sizeOf = require('image-size');
                sizeOf(filePath, (error: Error, dimensions: { width: number, height: number }) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(dimensions);
                    }
                });
            } catch (e) {
                logger.log('The "image-size" package is not installed.');
                reject(new Error('"image-size" package not found'));
            }
        });
    }

    private compressToWebP(uri: vscode.Uri): void {
        if (!uri || !uri.fsPath) {
            throw new Error('Please select a folder to compress images.');
        }
        const folderPath = uri.fsPath;
        const scriptPath = path.join(this.context.extensionPath, 'scripts', 'compress_to_webp.sh');
        if (!fs.existsSync(scriptPath)) {
            throw new Error('compress_to_webp.sh script not found.');
        }
        try {
            const output = execSync(`sh "${scriptPath}" "${folderPath}"`);
            logger.log(`compressToWebP output: ${output.toString()}`);
        } catch (error: any) {
            const errorMessage = error.stderr?.toString() || error.stdout?.toString() || (error instanceof Error ? error.message : String(error));
            logger.log(`compressToWebP错误: ${errorMessage}`);
            throw new Error('Failed to compress images to webp.');
        }
    }

    private async generateAssets(): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        const projectRoot = workspaceFolder.uri.fsPath;
        const pubspecPath = path.join(projectRoot, 'pubspec.yaml');
        const genDir = path.join(projectRoot, 'lib', 'gen');

        // 检查 pubspec.yaml 是否存在
        try {
            await vscode.workspace.fs.stat(vscode.Uri.file(pubspecPath));
        } catch {
            throw new Error('当前目录不是Flutter项目 (pubspec.yaml不存在)');
        }

        // 检查 gen 目录是否存在
        let genDirExists = true;
        try {
            await vscode.workspace.fs.stat(vscode.Uri.file(genDir));
        } catch {
            genDirExists = false;
        }

        if (!genDirExists) {
            logger.log('gen目录不存在，跳过 asset generation');
            return;
        }

        // 删除 lib/gen 下除了 env 目录之外的所有文件
        await this.deleteFilesExceptEnv(genDir);
        logger.log('已删除 lib/gen 下除 env 目录之外的所有文件');

        // 构建命令，增加 --delete-conflicting-outputs 参数
        const baseCommand = await this.getBuildCommand(projectRoot);
        const command = `${baseCommand} --delete-conflicting-outputs --build-filter="lib/gen/**"`;
        logger.log(`开始构建 assets, 命令: ${command}`);

        return new Promise((resolve, reject) => {
            exec(command, { cwd: projectRoot }, async (error, stdout, stderr) => {
                if (error) {
                    logger.log(`generateAssets错误: ${error.message}`);
                    reject(error);
                    return;
                }
                logger.log(`generateAssets标准输出: ${stdout}`);
                resolve();
            });
        });
    }

    /**
     * 递归删除目录下的所有文件，但保留 env 子目录及其内容
     * 实现类似 shell 命令: find lib/gen -path "lib/gen/env" -prune -o -type f -exec rm -f {} \;
     */
    private async deleteFilesExceptEnv(dirPath: string): Promise<void> {
        const dirUri = vscode.Uri.file(dirPath);
        const entries = await vscode.workspace.fs.readDirectory(dirUri);

        for (const [name, type] of entries) {
            const fullPath = path.join(dirPath, name);

            // 跳过 env 目录
            if (name === 'env' && type === vscode.FileType.Directory) {
                continue;
            }

            if (type === vscode.FileType.Directory) {
                // 递归处理子目录
                await this.deleteFilesExceptEnv(fullPath);
            } else if (type === vscode.FileType.File) {
                // 删除文件
                try {
                    await vscode.workspace.fs.delete(vscode.Uri.file(fullPath));
                    logger.log(`已删除文件: ${fullPath}`);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    logger.log(`删除文件失败 ${fullPath}: ${errorMessage}`);
                }
            }
        }
    }
}
