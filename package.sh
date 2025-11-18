#!/bin/bash

# 严格模式：遇到错误就退出，使用未定义变量就退出
set -euo pipefail

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数: 彩色输出
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 函数: 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 函数: 检查文件是否存在
check_file_exists() {
    if [ ! -f "$1" ]; then
        log_error "文件不存在: $1"
        return 1
    fi
    return 0
}

# 函数: 更新版本号
update_version() {
    log_info "正在更新版本号..."
    
    # 检查 package.json 是否存在
    check_file_exists "package.json" || return 1

    # 读取当前版本号
    if ! current_version=$(node -p "require('./package.json').version" 2>/dev/null); then
        log_error "无法读取 package.json 中的版本号"
        return 1
    fi

    # 验证版本号格式
    if [[ ! $current_version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        log_error "版本号格式不正确: $current_version"
        return 1
    fi

    # 分割版本号
    IFS='.' read -ra version_parts <<<"$current_version"

    # 增加最后一个数字
    ((version_parts[2]++))

    # 组合新版本号
    new_version="${version_parts[0]}.${version_parts[1]}.${version_parts[2]}"

    # 创建 package.json 备份
    cp package.json package.json.bak

    # 更新 package.json 中的版本号
    if sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" package.json; then
        log_success "版本升级: $current_version → $new_version"
        # 删除备份文件
        rm -f package.json.bak
        return 0
    else
        log_error "版本号更新失败，正在恢复备份..."
        mv package.json.bak package.json
        return 1
    fi
}

# 函数: 编译项目
compile_project() {
    log_info "正在编译 TypeScript 代码..."
    
    # 检查 tsconfig.json 是否存在
    if [ ! -f "tsconfig.json" ]; then
        log_error "tsconfig.json 文件不存在"
        return 1
    fi
    
    if npm run compile; then
        log_success "编译完成"
        return 0
    else
        log_error "编译失败，请检查 TypeScript 错误"
        return 1
    fi
}

# 函数: 打包插件
package_extension() {
    log_info "正在打包 VSCode 插件..."
    
    # 删除旧版本的 .vsix 文件
    if ls flutter-plugins-*.vsix 1> /dev/null 2>&1; then
        log_warning "删除旧的 .vsix 文件..."
        rm -f flutter-plugins-*.vsix
    fi

    # 编译项目
    compile_project || return 1

    # 打包插件，自动回答 "yes"
    if echo "y" | vsce package --no-yarn; then
        log_success "插件打包完成"
        return 0
    else
        log_error "插件打包失败"
        return 1
    fi
}

# 函数: 检查编辑器是否正在运行
check_editor_running() {
    local editor_name=$1
    case $editor_name in
        "VSCode")
            pgrep -f "Visual Studio Code" >/dev/null 2>&1
            ;;
        "Cursor")
            pgrep -f "Cursor" >/dev/null 2>&1
            ;;
        "Trae")
            pgrep -f "Trae" >/dev/null 2>&1
            ;;
        *)
            return 1
            ;;
    esac
}

# 函数: 安装插件到编辑器
install_extension() {
    local editor=$1
    local code_path=$2
    local vsix_file=$3
    local extension_id=$4

    echo ""
    log_info "正在处理 $editor 插件安装..."

    # 检查编辑器是否正在运行
    local editor_running=false
    if check_editor_running "$editor"; then
        editor_running=true
        log_warning "$editor 正在运行，可能会影响插件卸载/安装"
    fi

    # 检查插件是否已安装，如果已安装则先卸载
    local installed_extensions
    installed_extensions=$("$code_path" --list-extensions 2>/dev/null || echo "")
    
    if echo "$installed_extensions" | grep -qi "$extension_id"; then
        log_info "检测到 $editor 已安装旧版本，正在卸载..."
        
        # 尝试卸载旧版本
        local uninstall_output
        uninstall_output=$("$code_path" --uninstall-extension "$extension_id" 2>&1)
        local uninstall_exit_code=$?
        
        if [ $uninstall_exit_code -eq 0 ]; then
            log_success "$editor 旧版本卸载成功"
            sleep 1  # 等待卸载完成
        else
            # 检查错误信息
            local error_msg=$(echo "$uninstall_output" | tr '\n' ' ')
            
            # 如果是"未安装"的错误，说明插件列表检测有误，可以继续安装
            if echo "$error_msg" | grep -qi "not installed\|找不到\|not found"; then
                log_info "$editor 插件实际上未安装，跳过卸载步骤"
            # 如果编辑器正在运行，卸载失败是正常的，可以尝试覆盖安装
            elif [ "$editor_running" = true ]; then
                log_warning "$editor 正在运行，卸载失败（这是正常的，VSCode 运行时可能无法卸载插件）"
                log_info "将尝试直接覆盖安装（VSCode 支持覆盖安装）..."
            else
                # 其他错误，显示详细信息但继续尝试安装
                log_warning "$editor 旧版本卸载失败: $error_msg"
                log_info "将尝试直接覆盖安装..."
            fi
        fi
    else
        log_info "$editor 未检测到旧版本，直接安装新版本"
    fi

    # 安装新版本
    log_info "正在安装新版本到 $editor..."
    local install_output
    install_output=$("$code_path" --install-extension "$vsix_file" 2>&1)
    local install_exit_code=$?
    
    if [ $install_exit_code -eq 0 ]; then
        log_success "$editor 插件安装成功！"
        if [ "$editor_running" = true ]; then
            log_warning "请重启 $editor 以使插件生效"
        fi
        return 0
    else
        # 检查是否是覆盖安装的情况（某些情况下会返回非零但实际成功）
        if echo "$install_output" | grep -qi "already installed\|已安装\|installed"; then
            log_success "$editor 插件已是最新版本或安装成功"
            if [ "$editor_running" = true ]; then
                log_warning "请重启 $editor 以使插件生效"
            fi
            return 0
        else
            log_error "$editor 插件安装失败: $install_output"
            return 1
        fi
    fi
}

# 函数: 检查并安装 npm 依赖
check_npm_dependencies() {
    log_info "检查 npm 项目依赖..."
    
    # 检查 package.json 是否存在
    if [ ! -f "package.json" ]; then
        log_error "package.json 文件不存在"
        return 1
    fi
    
    # 检查 node_modules 是否存在
    if [ ! -d "node_modules" ]; then
        log_warning "node_modules 目录不存在，正在安装依赖..."
        if ! npm install; then
            log_error "npm 依赖安装失败，请检查网络连接或 npm 配置"
            return 1
        fi
        log_success "npm 依赖安装完成"
        return 0
    fi
    
    # 检查 package.json 中的依赖是否都已安装
    # 使用 npm list 检查，如果有缺失依赖会返回非零退出码
    if ! npm list --production --depth=0 --silent >/dev/null 2>&1; then
        log_warning "检测到缺失的 npm 依赖，正在安装..."
        if ! npm install; then
            log_error "npm 依赖安装失败，请检查网络连接或 npm 配置"
            return 1
        fi
        log_success "npm 依赖安装完成"
        return 0
    fi
    
    log_success "npm 项目依赖检查通过"
    return 0
}

# 函数: 检查依赖
check_dependencies() {
    log_info "检查依赖环境..."
    
    local missing_deps=()
    
    # 检查所需命令
    for cmd in node npm vsce; do
        if ! command_exists "$cmd"; then
            missing_deps+=("$cmd")
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "缺少必要的依赖："
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo ""
        echo "请安装缺少的依赖后重试："
        echo "  node: https://nodejs.org/"
        echo "  npm: 通常随 node 一起安装"
        echo "  vsce: npm install -g vsce"
        return 1
    fi
    
    log_success "所有依赖检查通过"
    return 0
}

# 函数: 获取 VSIX 文件
get_vsix_file() {
    local vsix_files=(flutter-plugins-*.vsix)
    
    if [ ! -e "${vsix_files[0]}" ]; then
        log_error "未找到 .vsix 文件"
        return 1
    fi
    
    if [ ${#vsix_files[@]} -gt 1 ]; then
        log_warning "发现多个 .vsix 文件，使用最新的文件"
        # 按修改时间排序，获取最新的
        printf '%s\n' "${vsix_files[@]}" | xargs ls -t | head -n 1
    else
        echo "${vsix_files[0]}"
    fi
}

# 主程序
main() {
    echo "========================================"
    echo "Flutter Plugins VSCode Extension Packager"
    echo "========================================"
    echo ""
    
    # 检查依赖
    check_dependencies || exit 1
    echo ""
    
    # 检查并安装 npm 项目依赖
    check_npm_dependencies || exit 1
    echo ""
    
    # 更新版本号
    update_version || {
        log_error "版本更新失败"
        exit 1
    }
    echo ""

    # 打包插件
    package_extension || {
        log_error "插件打包失败"
        exit 1
    }
    echo ""

    # 获取新生成的 .vsix 文件名
    vsix_file=$(get_vsix_file)
    if [ -z "$vsix_file" ]; then
        log_error "未找到打包后的 .vsix 文件"
        exit 1
    fi
    
    log_success "找到插件文件: $vsix_file"

    # 读取插件 ID
    if ! extension_id=$(node -p "require('./package.json').publisher + '.' + require('./package.json').name" 2>/dev/null); then
        log_error "无法读取插件 ID"
        exit 1
    fi
    
    log_info "插件 ID: $extension_id"
    echo ""

    # 定义编辑器信息
    local editor_names=("VSCode" "Cursor" "Trae")
    local editor_paths=(
        "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"
        "/Applications/Cursor.app/Contents/Resources/app/bin/code"
        "/Applications/Trae.app/Contents/Resources/app/bin/marscode"
    )

    # 安装计数器
    local success_count=0
    local total_count=${#editor_names[@]}

    # 循环安装到各个编辑器
    for i in "${!editor_names[@]}"; do
        local editor_name="${editor_names[i]}"
        local editor_path="${editor_paths[i]}"
        
        if [ -f "$editor_path" ]; then
            if install_extension "$editor_name" "$editor_path" "$vsix_file" "$extension_id"; then
                success_count=$((success_count + 1))
            fi
        else
            log_warning "未找到 $editor_name 安装路径: $editor_path"
        fi
    done

    echo ""
    echo "========================================"
    log_success "插件部署完成！"
    echo "成功安装: $success_count/$total_count 个编辑器"
    if [ $success_count -gt 0 ]; then
        log_warning "请重启已安装插件的编辑器以使更改生效"
    fi
    echo "========================================"
}

# 执行主程序
main
