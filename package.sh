#!/bin/bash

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
    "$code_path" --list-extensions | grep -i "$extension_id" >/dev/null

    if [[ $? -eq 0 ]]; then
        echo "检测到 $editor 中已安装旧版本，正在卸载..."
        # 卸载旧版本
        "$code_path" --uninstall-extension "$extension_id"
        # 等待卸载完成
        sleep 1
    fi

    # 安装新版本
    echo "正在安装新版本到 $editor..."
    "$code_path" --install-extension "$vsix_file"

    if [[ $? -eq 0 ]]; then
        echo "$editor 插件安装成功！请完全退出 $editor 并重新启动以使更改生效。"
        return 0
    else
        echo "$editor 插件安装失败，请检查错误信息。"
        return 1
    fi
    echo ""
}

# 主程序
main() {
    # 更新版本号
    update_version

    # 打包插件
    package_extension

    if [[ $? -eq 0 ]]; then
        # 获取新生成的 .vsix 文件名
        vsix_file=$(ls flutter-plugins-*.vsix)

        # 读取插件 ID
        extension_id=$(node -p "require('./package.json').publisher + '.' + require('./package.json').name")

        # VSCode路径
        vscode_path="/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"

        # Cursor路径
        cursor_path="/Applications/Cursor.app/Contents/Resources/app/bin/code"

        # Trae路径
        trae_path="/Applications/Trae.app/Contents/Resources/app/bin/marscode"

        # 安装到VSCode
        if [ -f "$vscode_path" ]; then
            install_extension "VSCode" "$vscode_path" "$vsix_file" "$extension_id"
        else
            echo "未找到VSCode安装路径，跳过VSCode安装"
        fi

        # 安装到Cursor
        if [ -f "$cursor_path" ]; then
            install_extension "Cursor" "$cursor_path" "$vsix_file" "$extension_id"
        else
            echo "未找到Cursor安装路径，跳过Cursor安装"
        fi

        # 安装到Trae
        if [ -f "$trae_path" ]; then
            install_extension "Trae" "$trae_path" "$vsix_file" "$extension_id"
        else
            echo "未找到Trae安装路径，跳过Trae安装"
        fi

        echo "安装过程完成！"
    else
        echo "打包失败，请检查错误信息。"
    fi
}

# 执行主程序
main
