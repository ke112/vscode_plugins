# Flutter Plugins

Flutter Plugins is an extension of VS Code that helps you improve development efficiency.

If you want to read the Chinese version of README, [查看中文点击这里](/README_CN.md)

## Widget Extend

- Expand common components that are often used and inconvenient to use in actual development.。

## How to use

1. Select the widget you want to wrap, then press the `Extract List` shortcut key, and select `Extended Widgets` to wrap.
2. Currently supported widgets: (in ascending order)
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

## Quick Functions

- Add shortcut commands to the right-click menu of the project.

## How to use

1. Right-click the project, select `Quick Command` to use.
2. Currently supported commands:
    - `F_Build Runner` is suitable for general generation of Model, repository, and image resources
    - `F_Build Runner Quick` generates Model, repository, and image resources for local files/directories, which is faster
    - `F_Create Getx Page (Binding)` is suitable for quick creation of internal base class pages - only right click on the directory
    - `F_Create Getx Page (Binding-Internal)` is suitable for quick creation of pages - only right click on the directory
    - `F_Generate iOS app icons` is used to generate icons of various sizes required by iOS - Only 1024*1024.png
    - `F_Compress to webP` selects non-webp images in the directory and converts them to webp

## Snippet

- Very efficient code snippets, can greatly improve your development efficiency.

## How to use

1. Output keywords naturally, such as `fsb` for `SizedBox`, `fspacer` for `Spacer`, etc.
2. Currently supported code snippets all have identification features starting with `f` and are accompanied by Chinese descriptions for quick and easy selection. A unified prefix may be used to replace them in the future.

## Contribution

If you find it helpful, please star it.

This project will be continuously updated. If you have new ideas, welcome to submit issues or pull requests to [GitHub Repository](https://github.com/ke112/vscode_plugins). I will add new features when I am free.


## Contact
Flower Name : 徐凤年

Weixin ID : zhang1102d

Facebook : https://www.facebook.com/zhihua.zhang.3958

## Update Log

| Date       | Version | Update Content                                                        |
| ---------- | ------- | --------------------------------------------------------------------- |
| 2024-10-19 | v0.0.8  | Added n code snippets and Updated 2 widget support and README update. |
| 2024-10-15 | v0.0.7  | Updated 3 widget support.                                             |
| 2024-09-13 | v0.0.6  | Removed some pre-set import processing.                               |
| 2024-09-13 | v0.0.5  | Added const processing when extracting widgets.                       |
| 2024-09-10 | v0.0.4  | Updated README image display.                                         |
| 2024-09-10 | v0.0.3  | Updated new interface command support.                                |
| 2024-09-09 | v0.0.2  | Updated quick generate command support.                               |
| 2024-09-06 | v0.0.1  | Updated 8 widget support.                                             |


## Marketplace
[VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=zhangzhihua.flutter-plugins-zhangzhihua)