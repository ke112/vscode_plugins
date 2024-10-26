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

# 确保库都已经安装
# yarn install

# 编译并打包，自动回答 "yes"
yarn run compile && echo "y" | vsce package --no-yarn

if [[ $? -eq 0 ]]; then
    # 打开新版本的 .vsix 文件
    open -R flutter-plugins-*.vsix
fi
