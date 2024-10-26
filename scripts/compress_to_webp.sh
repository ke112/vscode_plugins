#!/bin/bash

# 定义要处理的图片文件夹路径
image_dir=$1

# 定义压缩后的质量 (针对webp)
quality="75"

# 图片总个数
imageNum=0
pngNum=0
jpgNum=0
jpegNum=0
webpNum=0
heicNum=0

# 压缩了的个数
compressNum=0

function handle_file() {
  echo "$file"
  if [[ "$file" == *.png || "$file" == *.jpg || "$file" == *.jpeg || "$file" == *.webp || "$file" == *.HEIC ]]; then
    imageNum=$(($imageNum + 1))
    if [[ "$file" == *.png ]]; then
      pngNum=$(($pngNum + 1))
      newfile="${file%.png}.webp"
      cwebp -quiet -q "$quality" "$file" -o "$newfile"
      rm -rf $file
      compressNum=$(($compressNum + 1))
      echo "Converted $file to $newfile"
    fi
    if [[ "$file" == *.jpg ]]; then
      jpgNum=$(($jpgNum + 1))
      newfile="${file%.jpg}.webp"
      cwebp -quiet -q "$quality" -mt "$file" -o "$newfile"
      rm -rf $file
      compressNum=$(($compressNum + 1))
      echo "Converted $file to $newfile"
    fi
    if [[ "$file" == *.jpeg ]]; then
      jpegNum=$(($jpegNum + 1))
      newfile="${file%.jpeg}.webp"
      cwebp -quiet -q "$quality" -mt "$file" -o "$newfile"
      rm -rf $file
      compressNum=$(($compressNum + 1))
      echo "Converted $file to $newfile"
    fi
    if [[ "$file" == *.HEIC ]]; then
      heicNum=$(($heicNum + 1))
      newfile="${file%.HEIC}.webp"
      cwebp -quiet -q "$quality" -mt "$file" -o "$newfile"
      rm -rf $file
      compressNum=$(($compressNum + 1))
      echo "Converted $file to $newfile"
    fi
    if [[ "$file" == *.webp ]]; then
      webpNum=$(($webpNum + 1))
      # cwebp -quiet -q "$quality" -mt "$file" -o "$file"
      # compressNum=$(($compressNum + 1))
    fi
  fi
}

# 定义递归遍历函数
function traverse() {
  for file in "$1"/*; do
    if [[ -d "$file" ]]; then
      traverse "$file"
    else
      handle_file
    fi
  done
}
function log() {
  echo "\033[42;97m $* \033[0m"
}
function showTime() {
  endTime=$(date +%Y-%m-%d-%H:%M:%S)
  endTime_s=$(date +%s)
  sumTime=$(($endTime_s - $startTime_s))
  log "==== 开始时间: $startTime"
  log "==== 结束时间: $endTime"
  endDes='==== 总共用时:'
  if (($sumTime > 60)); then
    hour=$(expr ${sumTime} / 60)
    used=$(expr ${hour} \* 60)
    left=$(expr ${sumTime} - ${used})
    log "${endDes} ${hour}分${left}秒"
  else
    log "${endDes} ${sumTime}秒"
  fi
}

startTime=$(date +%Y-%m-%d-%H:%M:%S)
startTime_s=$(date +%s)

# 显示压缩前的文件夹大小
r1=$(du -sh $image_dir)
start=$(echo $r1 | cut -d ' ' -f 1)

# 调用递归遍历函数
if [ -d "$image_dir" ]; then
  traverse "$image_dir"
elif [ -f "$image_dir" ]; then
  file=$image_dir
  handle_file
fi

# 显示压缩后的文件夹大小
r2=$(du -sh $image_dir)
end=$(echo $r2 | cut -d ' ' -f 1)

# 统计压缩了的个数
echo ""
echo ""
log "==== 本次共检索到${imageNum}张图片,压缩处理了${compressNum}张"
log "==== 本次共检索到${pngNum}张png图片"
log "==== 本次共检索到${jpgNum}张jpg图片"
log "==== 本次共检索到${jpegNum}张jpeg图片"
log "==== 本次共检索到${webpNum}张webp图片"
log "==== 本次共检索到${heicNum}张HEIC图片"
log "==== 压缩前大小:$start"
log "==== 压缩后大小:$end"
showTime
echo ""
echo ""
