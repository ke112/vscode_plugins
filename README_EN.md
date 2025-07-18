# Flutter Plugins

Flutter Plugins can help you improve your development efficiency. If you can’t find a perfect plugin for yourself, create your own.

If you want to read the Chinese version of README, [点击这里查看中文版本](/README_CN.md)

## 1. Widget Extend

- Expand the Flutter base library but add components that are often used in actual development but are not convenient to use.
- ✨ **Full RTL Layout Support** - All generated code uses RTL-friendly components and properties

### How to use

1. Select the components you want to include, then press the `Extract List` shortcut key and select `Expand Components`
2. Currently supported components are: (in alphabetical order)
    - `AfterLayout`
    - `AnnotatedRegion`
    - `AnimatedBuilder`
    - `ClipRRect`
    - `Directionality` ✨ RTL Support
    - `GestureDetector`
    - `InkWell`
    - `LayoutBuilder`
    - `MeasureSize`
    - `MediaQuery`
    - `Obx`
    - `PositionedDirectional` ✨ RTL Support
    - `PreferredSize`
    - `Stack`
    - `Theme`
    - `ValueListenableBuilder`
    - `ValueListenableListBuilder`
    - `VisibilityDetector`

## 2. Quick Functions

- Add shortcut commands to the right-click menu of the project.

### How to use

1. Right-click the project, select `Quick Command` to use.
2. Currently supported commands:
   - `★ Compress To WebP (Automatically replace the original image)` Select the non-WebP image in the directory to convert to WebP - Right-click the directory only
   - `★ Create Getx Page (Internal use)` Applicable to quickly create a page - Right-click the directory only
   - `★ Create Getx Page (Binding method)` Applicable to quickly create an internal basic class page - Right-click the directory only
   - `★ Generate Assets (Quick update lib/gen)` Applicable to generating local resources under lib/gen, faster
   - `★ Generate iOS App Icon (png images of various sizes)` Applicable to generating icons of various sizes required by iOS - Only 1024*1024.png - Right-click the directory|file
   - `★ Generate Part (Local fast json/retrofit)` Generate model, repository for local files/directories, faster
   - `★ Generate Project (Full project build)` Applicable to general generation of model, repository, and image resources

## 3. Snippet

- Very efficient code snippets, can greatly improve your development efficiency.
- ✨ **Full RTL Layout Support** - Uses `EdgeInsetsDirectional`, `BorderRadiusDirectional`, `PositionedDirectional` and other RTL-friendly components
- 🌍 **Multi-language Support** - Includes code snippets for Arabic, English and other locale settings

### RTL Support Features

- Uses `start/end` instead of `left/right` properties
- Supports `EdgeInsetsDirectional` and `BorderRadiusDirectional`
- Includes `Directionality` component for text direction control
- Provides bidirectional text processing code snippets

### How to use

1. Natural output keywords, such as `fsb` for `SizedBox`, `fspacer` for `Spacer`, etc.
2. Currently, all embedded code snippets have Chinese descriptions

## Contribution

If you find it helpful, please star it.

This project will be continuously updated. If you have new ideas, welcome to submit issues or pull requests to [GitHub Repository](https://github.com/ke112/vscode_plugins). I will add new features when I am free.


## Contact
Flower Name : 徐凤年

Weixin ID : zhang1102d

Facebook : https://www.facebook.com/zhihua.zhang.3958

## Update Log

| Date       | Version | Update Content                                                             |
| ---------- | ------- | -------------------------------------------------------------------------- |
| 2025-01-11 | v0.0.11 | Update code robustness and efficiency.                                     |
| 2024-11-13 | v0.0.10 | Update the shortcut function for generating lib/gen resources.             |
| 2024-11-11 | v0.0.9  | Update one-click generation of all iOS logo sizes, image compression webp. |
| 2024-10-19 | v0.0.8  | Update n code snippets, update 2 component support, README update.         |
| 2024-10-15 | v0.0.7  | Update 3 component support.                                                |
| 2024-09-13 | v0.0.6  | Remove some preset import processing.                                      |
| 2024-09-13 | v0.0.5  | Update const processing.                                                   |
| 2024-09-10 | v0.0.4  | Update README text and graphics.                                           |
| 2024-09-10 | v0.0.3  | Update new interface command support.                                      |
| 2024-09-09 | v0.0.2  | Update fast generation command support.                                    |
| 2024-09-06 | v0.0.1  | Update 8 component support.                                                |


## Marketplace
[VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=zhangzhihua.flutter-plugins-zhangzhihua)