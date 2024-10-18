# Flutter Plugins

Flutter Plugins by zhangzhihua is a VS Code extension that encapsulates some common basic functions and improves development efficiency.

## Wrapping function

- Expand common components that are frequently used and inconvenient to use in actual development.

![hit_image](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEJgUY9CkCuzICNYVn05iYHAejHuWhwz4G6JPwvXLO0EoLcfdJ2KJppMv9S4xbYVDwmr28An.wEy.A9lcpWsc*QE!/b&bo=dgHPAQAAAAADF4s!&rf=viewer_4)
## Usage method

1. Select the widget you want to wrap, then press `Extract List` Shortcut key, select `Extended components` You can。
2. Currently supported components are: (in ascending order)
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

## Quick Functions

- Expand the right-click function to add shortcut commands to the project.

![hit_order](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEJgUY9CkCuzICNYVn05iYHD.lhmdZiS80y7mzMAOg.lVmbf2uId5Ey3viPG*EaocOCQL7l6BowiM25fmSJR67lM!/b&bo=JQKRAAAAAAADF4Q!&rf=viewer_4)


## Usage method

1. Right-click the project and select `Quick Commands` You can。
2. Currently supported commands are：
    - `Quick Build Runner` (Applicable to quickly generate Model and repository from local files/directories) 
    - `Run Build Runner` (Applicable to fully generate Model, repository, and image resources)
    - `新建Getx界面 (Binding方式-内部)` (Quickly create a new internal base class page - limited to directory right click)
    - `新建Getx界面 (Binding方式)` (Quickly create a new page - limited to right click on directory)

- Call build_runner method
![new_getx_1](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEJgUY9CkCuzICNYVn05iYHBszHAYqex*nghI79thS4*7Wz0vvnYBMVLC2Fy.yUeNH67q5I79ykt9SE8wjxKqEXI!/b&bo=8AKsAQAAAAADB30!&rf=viewer_4)

- Call build_runner result
![new_getx_1](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEJgUY9CkCuzICNYVn05iYHBj63.EAi1dnrF1UdWyXZhOCfW65iAUjb2EAjFsQkMkUZtH*w8ezTV8dPJAT4cB*6A!/b&bo=DAQ5AgAAAAADFwE!&rf=viewer_4)

- Generated directory structure
![new_getx_1](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEOnhRa1ObNeut5ljc0i0D.YgIRJvQk8K462OhcbBU1l1NlJMfHsERzSPaSXzXdHxf2TRjVPPrK7KdmrAouGiBJo!/b&bo=UwGyAAAAAAADF9I!&rf=viewer_4)

- Generated binding
![new_getx_2](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEOnhRa1ObNeut5ljc0i0D.ah15XlEZAI4TK*GHHgYka10AekVf0.DT5GPM.okJGPJmXXMfWMod4DUl0GghOmKJE!/b&bo=6ALwAAAAAAADFyg!&rf=viewer_4)

- Generated controller
![new_getx_3](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEOnhRa1ObNeut5ljc0i0D.bbpi*YApI46yRqK66.*SDm*0Rwn6nI*eQ73q23AkRkEI2yy.sLyJQGBYiHsVfXzSI!/b&bo=8wG6AQAAAAADF3s!&rf=viewer_4)

- Generated view
![new_getx_4](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEOnhRa1ObNeut5ljc0i0D.Zbi*0gaHD9xWovrIiPIYnb1h8fnf.l4hESLLOMq18ie.ndFgg69QDT0GvN93L.fls!/b&bo=wwJRAwAAAAADJ5E!&rf=viewer_4)

- Generated controller (internal)
![new_getx_5](https://m.qpic.cn/psc?/V51FA3BJ32r9zS4Pz0IS028JeT229j0A/TmEUgtj9EK6.7V8ajmQrEGOD9DSw4C1bXrlrYUUuWfXvyGcOXSo8Lt4VtWBMSl4lIKJVYCcwITQ2YYX7qXpvHQZyJeIzWyrd4Ra*XDodj4Y!/b&bo=YwKaAQAAAAADB9g!&rf=viewer_4)

## contribute

If it helps you, welcome to star.

This project will be updated all the time. If you want to add new features, please submit issues or pull requests to [GitHub Repository](https://github.com/ke112/vscode_plugins)，I will add new features in my spare time.


## connect
WeChat : zhang1102d

## Changelog

| Date       | Version | Updates                                        |
| ---------- | ------- | ---------------------------------------------- |
| 2024-09-13 | v0.0.6  | Remove some prefabricated import processing.   |
| 2024-09-13 | v0.0.5  | Added const handling when extracting packages. |
| 2024-09-10 | v0.0.4  | Updated README text and graphics.              |
| 2024-09-10 | v0.0.3  | Updated command support for new interfaces.    |
| 2024-09-09 | v0.0.2  | Updated quick generate command support.        |
| 2024-09-06 | v0.0.1  | Updated 8 package component support.           |

## vscode application market through train
[Jump to vscode application market](https://marketplace.visualstudio.com/items?itemName=zhangzhihua.flutter-plugins-zhangzhihua)


## license

This project uses the [MIT License](LICENSE)。