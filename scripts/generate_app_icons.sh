#!/bin/bash
# 生成 iOS Logo 图标脚本
# 调用方式 : sh generate_app_icons.sh /Users/ke/Desktop/icon-1024.png

# 设置 NODE_PATH 环境变量
export NODE_PATH=$(npm root -g):$NODE_PATH

SOURCE_ICON=$1
DEST_FOLDER="$HOME/Desktop/AppIcon.appiconset"
REMOVE_TEMP_FOLDER=true
GENERATE_1X=false
# 输出1x 2x 3x图标的尺寸列表（包含浮点数）
sizes=(20 29 38 40 60 64 68 76 83.5)
# sizes=(16 32 64 128 256 512)

# 检测回到flutter主目录
function checkFlutter() {
  local current_dir=$(pwd)
  while true; do
    # 检查当前目录下是否有lib目录
    if [ -d "$current_dir/lib" ] && [ -f "$current_dir/pubspec.yaml" ]; then
      # 如果有lib目录，停留在当前目录
      cd "$current_dir"
      break
    else
      # 如果没有lib目录，回溯到父目录
      current_dir=$(dirname "$current_dir")
    fi
    # 如果回溯到了根目录，停止
    if [ "$current_dir" == "/" ]; then
      echo "没有找到包含lib目录的父目录"
      echo "未知项目类型"
      exit 1
    fi
  done
}

if [ ! -f "$SOURCE_ICON" ]; then
  echo "源图标文件不存在！"
  exit
fi

if [[ ${SOURCE_ICON##*.} != "png" || $(identify -format "%w %h" $SOURCE_ICON) != "1024 1024" ]]; then
  echo "源图标文件不是png格式或分辨率不是1024*1024！"
  exit
fi

# 检查ImageMagick是否安装
if ! command -v convert &>/dev/null; then
  echo "ImageMagick (convert) 未安装，请先安装 ImageMagick"
  exit
fi

if [ -d "$DEST_FOLDER" ]; then
  rm -rf "$DEST_FOLDER"
fi

# 创建目标文件夹
mkdir -p "$DEST_FOLDER"

# 复制原始图标并重命名
cp "$SOURCE_ICON" "$DEST_FOLDER/icon-1024.png"

# 初始化 JSON 内容
json_content='{
  "images" : [
'

# 遍历尺寸并生成2x和3x的图标
for size in "${sizes[@]}"; do
  # 生成1x图标
  if [ $GENERATE_1X=true ]; then
    size1x=$(echo "$size * 1" | bc)
    convert "$SOURCE_ICON" -resize "${size1x}x${size1x}" "$DEST_FOLDER/icon-${size}.png"
    echo "生成 $DEST_FOLDER/icon-${size}.png 尺寸: ${size1x}x${size1x}"
    json_content+='    {
        "filename" : "icon-'${size}'.png",
        "idiom" : "universal",
        "platform" : "ios",
        "scale" : "1x",
        "size" : "'${size}'x'${size}'"
      },
'
  fi

  # 生成2x图标
  size2x=$(echo "$size * 2" | bc)
  convert "$SOURCE_ICON" -resize "${size2x}x${size2x}" "$DEST_FOLDER/icon-${size}@2x.png"
  echo "生成 $DEST_FOLDER/icon-${size}@2x.png 尺寸: ${size2x}x${size2x}"
  json_content+='    {
      "filename" : "icon-'${size}'@2x.png",
      "idiom" : "universal",
      "platform" : "ios",
      "scale" : "2x",
      "size" : "'${size}'x'${size}'"
    },
'

  # 生成3x图标，处理特殊情况
  # iPad 不需要3.0x的图标
  if [ "$size" != "83.5" ]; then
    size3x=$(echo "$size * 3" | bc)
    convert "$SOURCE_ICON" -resize "${size3x}x${size3x}" "$DEST_FOLDER/icon-${size}@3x.png"
    echo "生成 $DEST_FOLDER/icon-${size}@3x.png 尺寸: ${size3x}x${size3x}"
    json_content+='    {
      "filename" : "icon-'${size}'@3x.png",
      "idiom" : "universal",
      "platform" : "ios",
      "scale" : "3x",
      "size" : "'${size}'x'${size}'"
    },
'
  fi

done

# 添加原始图标到 JSON 内容
json_content+='    {
      "filename" : "icon-1024.png",
      "idiom" : "universal",
      "platform" : "ios",
      "scale" : "1x",
      "size" : "1024x1024"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}'

# 将 JSON 内容写入 Contents.json 文件
echo "$json_content" >"$DEST_FOLDER/Contents.json"

echo "所有图标已生成并放入 $DEST_FOLDER 文件夹！"
echo "Contents.json 文件已生成！"

# ios原生项目
# /Users/ke/Desktop/ios111/ios111/Assets.xcassets/AppIcon.appiconset
# 纯flutter项目
# /Users/ke/Desktop/ai_client_3/ios/Runner/Assets.xcassets/AppIcon.appiconset

IOS_FOLDER="" #ios项目根目录
ICON_PARENT_DIR=$(dirname "$SOURCE_ICON")
cd "$ICON_PARENT_DIR"
echo "当前icon所在目录: $ICON_PARENT_DIR"
if [[ $ICON_PARENT_DIR == */ios/Runner/* ]]; then
  # 使用sed截取到/ios的路径
  IOS_FOLDER=$(echo "$ICON_PARENT_DIR" | sed 's/\(.*\/ios\).*/\1/')
  # 拼接到Runner目录
  IOS_FOLDER="$IOS_FOLDER/Runner"
  echo "纯flutter项目 : $IOS_FOLDER"
elif [[ $ICON_PARENT_DIR == */Assets.xcassets/* ]]; then
  # 使用更简单的方式拿到ios项目根目录
  IOS_FOLDER=${ICON_PARENT_DIR%/Assets.xcassets/*}
  echo "ios原生项目 : $IOS_FOLDER"
else
  checkFlutter
  if [ $? == 0 ]; then
    current_dir=$(pwd)
    IOS_FOLDER="$current_dir/ios/Runner"
  fi
fi

# 确保目标文件夹存在
if [ ! -d "$IOS_FOLDER" ]; then
  echo "错误: 目标文件夹不存在: $IOS_FOLDER"
  echo "请确保您在正确的项目根目录中运行此脚本"
  exit 1
fi

# 移动图标到目标文件夹
if [ -d "$IOS_FOLDER/Assets.xcassets/AppIcon.appiconset" ]; then
  mv -f $DEST_FOLDER/* "$IOS_FOLDER/Assets.xcassets/AppIcon.appiconset"
else
  echo "错误: 目标文件夹不存在: $IOS_FOLDER/Assets.xcassets/AppIcon.appiconset"
  exit 1
fi

# 删除临时文件夹
if [ $REMOVE_TEMP_FOLDER=true ]; then
  rm -rf "$DEST_FOLDER"
fi
