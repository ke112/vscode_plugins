# Flutter Plugins

Flutter Plugins 能帮助你提高开发效率，找不到一个完美的插件适合自己，那就自己创造。

If you want to read the English version of README, [click here to view the English version](/README_EN.md)

## Part 1 : 组件扩展

- 扩展Flutter基础库中没有，但实际开发中经常使用而又不方便使用的组件。

### 使用方法

1. 选择你要包括的组件，然后按 `提取列表` 快捷键，选择 `拓展组件` 即可。
2. 目前支持的组件有：(按字母排序)
    - `AfterLayout`
    - `AnnotatedRegion`
    - `AnimatedBuilder`
    - `ClipRRect`
    - `GestureDetector`
    - `InkWell`
    - `LayoutBuilder`
    - `MeasureSize`
    - `MediaQuery`
    - `Obx`
    - `PreferredSize`
    - `Stack`
    - `Theme`
    - `ValueListenableBuilder`
    - `ValueListenableListBuilder`
    - `VisibilityDetector`

## Part 2 : 快捷命令

- 右键项目，选择 `快速命令` 即可。

### 使用方法

1. 右键项目，选择 `快速命令` 即可。
2. 目前支持的命令有：
   - `★ Compress To WebP  (自动替换)` 选择目录下非 WebP 图片转换为 WebP - 仅限目录右键
   - `★ Create Getx Page  (内部使用)` 适用于快速创建页面 - 仅限目录右键
   - `★ Create Getx Page  (Binding方式)` 适用于快速创建内部基础类页面 - 仅限目录右键
   - `★ Generate Assets  (快速更新lib/gen)` 适用于生成 lib/gen 下的本地资源，速度更快
   - `★ Generate iOS App Icon (各尺寸png图)` 适用于生成iOS需要各尺寸icon - 仅限1024*1024.png - 目录|文件右键
   - `★ Generate Part  (局部快速json/retrofit)` 针对局部文件/目录生成 model， repository，速度更快
   - `★ Generate Project  (全量项目构建)` 适用于常规生成 model， repository， 和 image资源
  
## Part 3 :代码片段

- 非常高效的代码片段，可以大大提高你的开发效率。

### 使用方法

1. 自然的输出关键词，比如 `fsb` 代表 `SizedBox`， `fspacer` 代表 `Spacer` 等。
2. 目前的内嵌代码片段，都会有中文的描述

## 贡献

如果觉得对你有帮助，欢迎 star。

这个项目会持续更新。如果你有新的想法，欢迎提交 issues 或 pull requests 到 [GitHub Repository](https://github.com/ke112/vscode_plugins)，空闲时我会添加新功能。


## 联系
花名 : 徐凤年

微信 : zhang1102d

脸书 : https://www.facebook.com/zhihua.zhang.3958

## 更新日志

| 日期       | 版本    | 更新内容                                       |
| ---------- | ------- | ---------------------------------------------- |
| 2025-01-11 | v0.0.11 | 更新代码健壮性和效率。                         |
| 2024-11-13 | v0.0.10 | 更新生成lib/gen资源的快捷功能。                |
| 2024-11-11 | v0.0.9  | 更新一键生成iOS所有尺寸logo，图片压缩webp。    |
| 2024-10-19 | v0.0.8  | 更新n个代码片段，更新2个组件支持，README更新。 |
| 2024-10-15 | v0.0.7  | 更新3个组件支持。                              |
| 2024-09-13 | v0.0.6  | 移除一些预设的import处理。                     |
| 2024-09-13 | v0.0.5  | 更新const处理。                                |
| 2024-09-10 | v0.0.4  | 更新README文本和图形。                         |
| 2024-09-10 | v0.0.3  | 更新新接口命令支持。                           |
| 2024-09-09 | v0.0.2  | 更新快速生成命令支持。                         |
| 2024-09-06 | v0.0.1  | 更新8个组件支持。                              |

## 插件市场
[VSCode插件市场](https://marketplace.visualstudio.com/items?itemName=zhangzhihua.flutter-plugins-zhangzhihua)