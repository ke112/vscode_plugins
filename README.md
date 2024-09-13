# Flutter Plugins

Flutter Plugins by zhangzhihua 是一个 VS Code 扩展，封装一些常用的基础功能，提高开发效率。

## 包裹功能

- 拓展实际开发中，使用频率高且使用不方便常用组件。

![hit_image](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEJgUY9CkCuzICNYVn05iYHAejHuWhwz4G6JPwvXLO0EoLcfdJ2KJppMv9S4xbYVDwmr28An.wEy.A9lcpWsc*QE!/b&bo=dgHPAQAAAAADF4s!&rf=viewer_4)
## 使用方法

1. 选中想要包裹的 widget，然后按下 `提取列表` 快捷键，选择 `拓展的组件` 即可。
2. 目前支持的组件有：(升序)
    - `AfterLayout`
    - `ClipRRect`
    - `GestureDetector`
    - `LayoutBuilder`
    - `MeasureSize`
    - `MediaQuery`
    - `Obx`
    - `Stack`
    - `ValueListenableBuilder`
    - `VisibilityDetector`

## 快捷功能

- 拓展在工程项目右键增加快捷命令。

![hit_order](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEJgUY9CkCuzICNYVn05iYHD.lhmdZiS80y7mzMAOg.lVmbf2uId5Ey3viPG*EaocOCQL7l6BowiM25fmSJR67lM!/b&bo=JQKRAAAAAAADF4Q!&rf=viewer_4)


## 使用方法

1. 右键工程项目，选择 `快捷命令` 即可。
2. 目前支持的命令有：
    - `Quick Build Runner` (适用于局部文件/目录快速生成Model、repository) 
    - `Run Build Runner` (适用于全量生成Model、repository、图片资源)
    - `新建Getx界面 (Binding方式-内部)` (快速新建内部基类页面 - 限于目录右键)
    - `新建Getx界面 (Binding方式)` (快速新建页面 - 限于目录右键)

- 调用build_runner方式
![new_getx_1](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEJgUY9CkCuzICNYVn05iYHBszHAYqex*nghI79thS4*7Wz0vvnYBMVLC2Fy.yUeNH67q5I79ykt9SE8wjxKqEXI!/b&bo=8AKsAQAAAAADB30!&rf=viewer_4)

- 调用build_runner结果
![new_getx_1](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEJgUY9CkCuzICNYVn05iYHBj63.EAi1dnrF1UdWyXZhOCfW65iAUjb2EAjFsQkMkUZtH*w8ezTV8dPJAT4cB*6A!/b&bo=DAQ5AgAAAAADFwE!&rf=viewer_4)

- 生成的目录结构
![new_getx_1](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEOnhRa1ObNeut5ljc0i0D.YgIRJvQk8K462OhcbBU1l1NlJMfHsERzSPaSXzXdHxf2TRjVPPrK7KdmrAouGiBJo!/b&bo=UwGyAAAAAAADF9I!&rf=viewer_4)

- 生成的bingding
![new_getx_2](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEOnhRa1ObNeut5ljc0i0D.ah15XlEZAI4TK*GHHgYka10AekVf0.DT5GPM.okJGPJmXXMfWMod4DUl0GghOmKJE!/b&bo=6ALwAAAAAAADFyg!&rf=viewer_4)

- 生成的controller
![new_getx_3](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEOnhRa1ObNeut5ljc0i0D.bbpi*YApI46yRqK66.*SDm*0Rwn6nI*eQ73q23AkRkEI2yy.sLyJQGBYiHsVfXzSI!/b&bo=8wG6AQAAAAADF3s!&rf=viewer_4)

- 生成的view
![new_getx_4](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEOnhRa1ObNeut5ljc0i0D.Zbi*0gaHD9xWovrIiPIYnb1h8fnf.l4hESLLOMq18ie.ndFgg69QDT0GvN93L.fls!/b&bo=wwJRAwAAAAADJ5E!&rf=viewer_4)

- 生成的view (内部)
![new_getx_5](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEOS2qrtwEaCuqkdxvQiC64zl4pi3h*m9Wb.7yl4OA0IcorVwV3XQgmTCwCUejVN02Ui3uAmjQDYiW0vsn*A5.UY!/b&bo=mQK6AQAAAAADFxI!&rf=viewer_4)

## 贡献

如果对你有帮助，欢迎 star。

此项目会一直更新，如果想新增功能，欢迎提交 issues 或 pull requests 到 [GitHub 仓库](https://github.com/ke112/vscode_plugins)，我会在工作之余时，增加新的feature。


## 联系
WeChat : zhang1102d

## 更新日志

| 日期       | 版本   | 更新内容                    |
| ---------- | ------ | --------------------------- |
| 2024-09-13 | v0.0.5 | 增加提取包裹时const的处理。 |
| 2024-09-10 | v0.0.4 | 更新了README图文显示。      |
| 2024-09-10 | v0.0.3 | 更新了新建界面的命令支持。  |
| 2024-09-09 | v0.0.2 | 更新了快捷生成命令支持。    |
| 2024-09-06 | v0.0.1 | 更新了8个包裹组件支持。     |


## vscode应用市场直通车
https://marketplace.visualstudio.com/items?itemName=zhangzhihua.flutter-plugins-zhangzhihua

## 许可

本项目采用 [MIT 许可证](LICENSE)。

## TODO  </s>

- ~~README图文显示~~
- 包裹组件widget判断
