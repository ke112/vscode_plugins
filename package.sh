#!/bin/bash
set -e

# 函数: 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 函数: 更新版本号
update_version() {
    # 读取当前版本号
    current_version=$(node -p "require('./package.json').version")

    # 分割版本号
    IFS='.' read -ra version_parts <<<"$current_version"

    # 增加最后一个数字
    ((version_parts[2]++))

    # 组合新版本号
    new_version="${version_parts[0]}.${version_parts[1]}.${version_parts[2]}"

    # 更新 package.json 中的版本号
    sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" package.json

    echo "版本升级 from $current_version to $new_version"

    return 0
}

# 函数: 打包插件
package_extension() {
    # 删除旧版本的 .vsix 文件
    rm -f flutter-plugins-*.vsix

    # 编译并打包，自动回答 "yes"
    yarn run compile && echo "y" | vsce package --no-yarn
    return $?
}

# 函数: 安装插件到编辑器
install_extension() {
    local editor=$1
    local code_path=$2
    local vsix_file=$3
    local extension_id=$4

    echo ""
    echo "正在检查 $editor 中的插件安装状态..."

    # 检查插件是否已安装
    if "$code_path" --list-extensions | grep -qi "$extension_id"; then
        echo "检测到 $editor 中已安装旧版本，正在卸载..."
        # 卸载旧版本，并将成功输出重定向，只在出错时显示错误
        if ! "$code_path" --uninstall-extension "$extension_id" >/dev/null; then
            echo "卸载 $editor 旧版本失败。"
            return 1
        fi
        # 等待卸载完成
        sleep 1
    fi

    # 安装新版本
    echo "正在安装新版本到 $editor..."
    if "$code_path" --install-extension "$vsix_file"; then
        echo "$editor 插件安装成功！请完全退出 $editor 并重新启动以使更改生效。"
        return 0
    else
        echo "$editor 插件安装失败，请检查错误信息。"
        return 1
    fi
}

# 主程序
main() {
    # 检查所需命令
    for cmd in node yarn vsce; do
        if ! command_exists "$cmd"; then
            echo "错误: 需要 '$cmd' 命令，但未找到。请先安装它。"
            exit 1
        fi
    done

    # 更新版本号
    update_version

    # 打包插件
    package_extension

    # 获取新生成的 .vsix 文件名
    vsix_file=$(ls flutter-plugins-*.vsix | head -n 1)
    if [ -z "$vsix_file" ]; then
        echo "打包失败：未找到 .vsix 文件。"
        exit 1
    fi

    # 读取插件 ID
    extension_id=$(node -p "require('./package.json').publisher + '.' + require('./package.json').name")

    # 定义编辑器信息
    editor_names=("VSCode" "Cursor" "Trae")
    editor_paths=(
        "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"
        "/Applications/Cursor.app/Contents/Resources/app/bin/code"
        "/Applications/Trae.app/Contents/Resources/app/bin/marscode"
    )

    # 循环安装到各个编辑器
    for i in "${!editor_names[@]}"; do
        editor_name="${editor_names[i]}"
        path="${editor_paths[i]}"
        if [ -f "$path" ]; then
            install_extension "$editor_name" "$path" "$vsix_file" "$extension_id"
        else
            echo ""
            echo "未找到 $editor_name 安装路径 ($path)，跳过安装。"
        fi
    done

    echo ""
    echo "所有安装过程完成！"
}

# 执行主程序
main
