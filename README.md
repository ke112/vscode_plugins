# FN Flutter Plugins

FN Flutter Plugins 能帮助你提高开发效率，找不到一个完美的插件适合自己，那就自己创造。

If you want to read the English version of README, [click here to view the English version](/README_EN.md)

## Part 1 : 组件扩展

- 扩展 Flutter 基础库中没有，但实际开发中经常使用而又不方便使用的组件。
- ✨ **全面支持 RTL 布局** - 所有生成的代码都使用 RTL 友好的组件和属性

### 使用方法

1. 选择你要包括的组件，然后按 `提取列表` 快捷键，选择 `拓展组件` 即可。
2. 目前支持的组件有：(按字母排序)
   - `AfterLayout`
   - `AnnotatedRegion`
   - `AnimatedBuilder`
   - `ClipRRect`
   - `Directionality` ✨ RTL 支持
   - `GestureDetector`
   - `InkWell`
   - `LayoutBuilder`
   - `MeasureSize`
   - `MediaQuery`
   - `Obx`
   - `PositionedDirectional` ✨ RTL 支持
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
   - `★ Generate iOS App Icon (各尺寸png图)` 适用于生成 iOS 需要各尺寸 icon - 仅限 1024\*1024.png - 目录|文件右键
   - `★ Generate Part  (局部快速json/retrofit)` 针对局部文件/目录生成 model， repository，速度更快
   - `★ Generate Project  (全量项目构建)` 适用于常规生成 model， repository， 和 image 资源

## Part 3 :代码片段

- 非常高效的代码片段，可以大大提高你的开发效率。
- ✨ **全面支持 RTL 布局** - 使用 `EdgeInsetsDirectional`、`BorderRadiusDirectional`、`PositionedDirectional` 等 RTL 友好组件
- 🌍 **多语言支持** - 包含阿拉伯语、英语等区域设置的代码片段

### RTL 支持特性

- 使用 `start/end` 替代 `left/right` 属性
- 支持 `EdgeInsetsDirectional` 和 `BorderRadiusDirectional`
- 包含 `Directionality` 组件用于控制文本方向
- 提供双向文本处理的代码片段

### 使用方法

1. 自然的输出关键词，比如 `sbw` 代表 `SizedBox(width: 16.w),`， `fspacer` 代表 `const Spacer(),` 等。
2. 目前的内嵌代码片段，都会有中文的描述

## 贡献

如果觉得对你有帮助，欢迎 star。

这个项目会持续更新。如果你有新的想法，欢迎提交 issues 或 pull requests 到 [GitHub Repository](https://github.com/ke112/vscode_plugins)，空闲时我会添加新功能。

## 联系

花名 : 徐凤年

微信 : zhang1102d

脸书 : https://www.facebook.com/zhihua.zhang.3958

## 更新日志

| 日期       | 版本    | 更新内容                                            |
| ---------- | ------- | --------------------------------------------------- |
| 2025-12-03 | v0.0.13 | 更新代码健壮性和效率。                              |
| 2025-07-18 | v0.0.12 | 更新代码健壮性和效率。                              |
| 2025-01-11 | v0.0.11 | 更新代码健壮性和效率。                              |
| 2024-11-13 | v0.0.10 | 更新生成 lib/gen 资源的快捷功能。                   |
| 2024-11-11 | v0.0.9  | 更新一键生成 iOS 所有尺寸 logo，图片压缩 webp。     |
| 2024-10-19 | v0.0.8  | 更新 n 个代码片段，更新 2 个组件支持，README 更新。 |
| 2024-10-15 | v0.0.7  | 更新 3 个组件支持。                                 |
| 2024-09-13 | v0.0.6  | 移除一些预设的 import 处理。                        |
| 2024-09-13 | v0.0.5  | 更新 const 处理。                                   |
| 2024-09-10 | v0.0.4  | 更新 README 文本和图形。                            |
| 2024-09-10 | v0.0.3  | 更新新接口命令支持。                                |
| 2024-09-09 | v0.0.2  | 更新快速生成命令支持。                              |
| 2024-09-06 | v0.0.1  | 更新 8 个组件支持。                                 |

## 插件市场

[VSCode 插件市场](https://marketplace.visualstudio.com/items?itemName=zhangzhihua.flutter-plugins-zhangzhihua)
