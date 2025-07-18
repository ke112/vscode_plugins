#!/bin/bash

# 检查 cwebp 是否安装，如果未安装则尝试使用 Homebrew 自动安装
if ! command -v cwebp &> /dev/null
then
    echo "cwebp could not be found. Checking for Homebrew to install it..."
    # 检查当前是否为 macOS
    if [[ "$(uname)" == "Darwin" ]] && command -v brew &> /dev/null; then
        echo "Homebrew found. Attempting to install webp..."
        if brew install webp; then
            echo "webp has been installed successfully."
            # 重新检查 cwebp 是否可用
            if ! command -v cwebp &> /dev/null; then
                echo "Error: webp was installed, but cwebp command is still not available. Please check your PATH."
                exit 1
            fi
        else
            echo "Error: Failed to install webp using Homebrew. Please install it manually."
            exit 1
        fi
    else
        echo "Error: Homebrew is not available. Please install webp manually."
        echo "On macOS, you can use Homebrew: brew install webp"
        exit 1
    fi
fi

# 定义要处理的图片文件夹路径
image_dir=$1
if [ -z "$image_dir" ]; then
    echo "Error: Please provide a directory path."
    exit 1
fi

# 定义压缩后的质量 (针对webp)
quality="75"

# 统计变量
imageNum=0
pngNum=0
jpgNum=0
jpegNum=0
webpNum=0
heicNum=0
compressNum=0
failNum=0

echo "Starting image compression in: $image_dir"
echo "=========================================="

# 使用 find 和 while read 循环来安全地处理所有文件名，包括带空格的文件
# -iname 是忽略大小写的匹配
find "$image_dir" \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.heic" \) -type f -print0 | while IFS= read -r -d '' file; do
  # 获取文件扩展名的小写形式
  extension="${file##*.}"
  extension_lower=$(echo "$extension" | tr '[:upper:]' '[:lower:]')
  
  original_file="$file" # 保存原始文件名
  temp_file="" # 用于跟踪临时文件

  # 检查是否是支持的图片格式
  case "$extension_lower" in
    png|jpg|jpeg|heic)
      # 对于 HEIC 文件，先使用 sips 转换为 png (仅在 macOS 上)
      if [[ "$extension_lower" == "heic" ]]; then
        if [[ "$(uname)" == "Darwin" ]] && command -v sips &> /dev/null; then
          temp_file="${original_file%.*}.heic.png"
          # sips 会在同目录下创建一个新的png文件
          if sips -s format png "$original_file" --out "$temp_file" >/dev/null 2>&1; then
            echo "Temporarily converted HEIC to PNG: $temp_file"
            file="$temp_file" # 更新要处理的文件为新创建的png
          else
            echo "Error: Failed to convert HEIC to PNG: $original_file"
            failNum=$(($failNum + 1))
            continue # 跳过此文件
          fi
        else
          echo "Warning: Cannot convert HEIC file on this system. 'sips' command not found (macOS only)."
          failNum=$(($failNum + 1))
          continue # 跳过此文件
        fi
      fi

      # 统计图片数量
      imageNum=$(($imageNum + 1))
      case "$extension_lower" in
          png) pngNum=$(($pngNum + 1));;
          jpg) jpgNum=$(($jpgNum + 1));;
          jpeg) jpegNum=$(($jpegNum + 1));;
          heic) heicNum=$(($heicNum + 1));;
      esac

      # 定义新的webp文件名 (基于原始文件名)
      newfile="${original_file%.*}.webp"
      
      # 执行转换
      if cwebp -quiet -q "$quality" -mt "$file" -o "$newfile"; then
        compressNum=$(($compressNum + 1))
        echo "SUCCESS: Converted $original_file -> $newfile"
        rm -f "$original_file" # 删除原始文件
        if [ -n "$temp_file" ]; then
          rm -f "$temp_file" # 删除临时png文件
        fi
      else
        failNum=$(($failNum + 1))
        echo "ERROR: Failed to convert $original_file"
        # 如果转换失败，也要清理临时文件
        if [ -n "$temp_file" ]; then
          rm -f "$temp_file"
        fi
      fi
      ;;
    *)
      # 由于 find 命令已经做了筛选，这里理论上不会执行
      ;;
  esac
done

# 统计已经存在的webp文件数量
webpNum=$(find "$image_dir" -type f -iname "*.webp" | wc -l | tr -d ' ')

# 最终的统计报告
echo "=========================================="
echo "Compression complete."
echo "Summary:"
echo " - Total images found: $imageNum (PNG: $pngNum, JPG: $jpgNum, JPEG: $jpegNum, HEIC: $heicNum, WebP: $webpNum)"
echo " - Successfully converted: $compressNum"
echo " - Failed or skipped: $failNum"
