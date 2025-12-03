# 新环境快速搭建指南

本文档说明如何在新电脑上快速搭建 VSCode 插件开发环境并成功打包。

## 📋 前置要求

### 1. 安装 Node.js 和 npm

**macOS:**
```bash
# 使用 Homebrew 安装（推荐）
brew install node

# 或从官网下载安装
# https://nodejs.org/
```

**Linux:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

**Windows:**
- 从 [Node.js 官网](https://nodejs.org/) 下载安装包
- 安装时选择 "Add to PATH" 选项

**验证安装:**
```bash
node --version  # 应该显示 v14.x 或更高版本
npm --version   # 应该显示 6.x 或更高版本
```

### 2. 安装 VSCode Extension Manager (vsce)

```bash
npm install -g vsce
```

**验证安装:**
```bash
vsce --version
```

## 🚀 快速开始

### 步骤 1: 克隆项目

```bash
git clone https://github.com/ke112/vscode_plugins.git
cd vscode_plugins
```

### 步骤 2: 安装项目依赖

```bash
npm install
```

这会自动安装 `package.json` 中声明的所有依赖，包括：
- 开发依赖（devDependencies）：TypeScript、ESLint 等
- 生产依赖（dependencies）：image-size 等

### 步骤 3: 打包插件

```bash
sh package.sh
```

打包脚本会自动执行以下操作：
1. ✅ 检查系统依赖（node、npm、vsce）
2. ✅ 检查并自动安装 npm 项目依赖（如果缺失）
3. ✅ 自动更新版本号（patch 版本 +1）
4. ✅ 编译 TypeScript 代码
5. ✅ 打包生成 .vsix 文件
6. ✅ 自动安装到已安装的编辑器（VSCode、Cursor、Trae）

## 🔧 常见问题排查

### 问题 1: `npm install` 失败

**可能原因：**
- 网络连接问题
- npm 镜像源访问慢

**解决方案：**
```bash
# 使用国内镜像源（推荐）
npm config set registry https://registry.npmmirror.com

# 或使用淘宝镜像
npm config set registry https://registry.npm.taobao.org

# 然后重新安装
npm install
```

### 问题 2: `vsce` 命令未找到

**解决方案：**
```bash
# 全局安装 vsce
npm install -g vsce

# 如果权限不足，使用 sudo（macOS/Linux）
sudo npm install -g vsce
```

### 问题 3: TypeScript 编译错误

**解决方案：**
```bash
# 检查 TypeScript 版本
npx tsc --version

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### 问题 4: 打包时提示缺少依赖

**解决方案：**
打包脚本已自动处理此问题。如果仍然失败，手动执行：
```bash
npm install
```

### 问题 5: 插件安装失败

**可能原因：**
- 编辑器正在运行
- 插件路径不正确

**解决方案：**
1. 关闭编辑器
2. 重新运行 `sh package.sh`
3. 或手动安装：`code --install-extension flutter-plugins-zhangzhihua-0.0.x.vsix`

## 📦 打包脚本功能说明

`package.sh` 脚本提供以下功能：

### 自动检查项
- ✅ 系统命令依赖（node、npm、vsce）
- ✅ npm 项目依赖（自动安装缺失依赖）
- ✅ TypeScript 编译
- ✅ 版本号自动递增

### 自动操作
- 🔄 自动更新版本号（patch +1）
- 📦 自动编译 TypeScript
- 📦 自动打包生成 .vsix 文件
- 🚀 自动安装到已安装的编辑器

### 支持的编辑器
- Visual Studio Code
- Cursor
- Trae

## 🎯 一键安装脚本（可选）

如果需要更快速的安装，可以创建一键安装脚本：

```bash
#!/bin/bash
# install.sh - 一键安装脚本

echo "========================================"
echo "Flutter Plugins VSCode Extension - 环境安装"
echo "========================================"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js"
    echo "   访问: https://nodejs.org/"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 未检测到 npm"
    exit 1
fi

# 检查 vsce
if ! command -v vsce &> /dev/null; then
    echo "📦 正在安装 vsce..."
    npm install -g vsce
fi

# 安装项目依赖
echo "📦 正在安装项目依赖..."
npm install

echo ""
echo "✅ 环境安装完成！"
echo "   现在可以运行: sh package.sh"
```

## 📝 开发流程

1. **修改代码** → 编辑 `src/` 目录下的 TypeScript 文件
2. **编译测试** → `npm run compile` 或 `npm run watch`
3. **打包发布** → `sh package.sh`
4. **测试插件** → 在编辑器中测试新功能

## 🔗 相关链接

- [Node.js 官网](https://nodejs.org/)
- [npm 文档](https://docs.npmjs.com/)
- [VSCode Extension API](https://code.visualstudio.com/api)
- [vsce 文档](https://github.com/microsoft/vscode-vsce)

## 💡 提示

- 首次安装后，后续只需要运行 `sh package.sh` 即可
- 打包脚本会自动处理依赖检查和安装
- 建议在打包前先运行 `npm run compile` 检查编译错误
- 如果修改了 `package.json` 的依赖，记得运行 `npm install`

