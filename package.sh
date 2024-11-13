#!/bin/bash

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

# 删除旧版本的 .vsix 文件
rm -f flutter-plugins-*.vsix

# 编译并打包，自动回答 "yes"
yarn run compile && echo "y" | vsce package --no-yarn

if [[ $? -eq 0 ]]; then
    # 获取新生成的 .vsix 文件名
    vsix_file=$(ls flutter-plugins-*.vsix)

    # 读取插件 ID
    extension_id=$(node -p "require('./package.json').publisher + '.' + require('./package.json').name")

    # 检查插件是否已安装
    "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" --list-extensions | grep -i "$extension_id" >/dev/null

    if [[ $? -eq 0 ]]; then
        echo "检测到已安装旧版本，正在卸载..."
        # 卸载旧版本
        "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" --uninstall-extension "$extension_id"
        # 等待卸载完成
        sleep 1
    fi

    # 安装新版本
    echo "正在安装新版本..."
    "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" --install-extension "$vsix_file"

    if [[ $? -eq 0 ]]; then
        echo "插件安装成功！请完全退出 Visual Studio Code 并重新启动以使更改生效。"
    else
        echo "插件安装失败，请检查错误信息。"
    fi
else
    echo "打包失败，请检查错误信息。"
fi
