import * as vscode from 'vscode';

interface SnippetInfo {
  snippet: string;
  description: string;
}

export class SnippetManager implements vscode.CompletionItemProvider {
  private snippets: { [key: string]: SnippetInfo } = {
    'fcontainer 容器': {
      snippet: `Container($1)`,
      description: 'Container'
    },
    'sb 设置宽高': {
      snippet: `SizedBox(width: 16.w, height: 16.w)`,
      description: '固定大小的 SizedBox'
    },
    'sbh 设置高度': {
      snippet: `SizedBox(height: 16.w)`,
      description: '固定高度的 SizedBox'
    },
    'sbw 设置宽度': {
      snippet: `SizedBox(width: 16.w)`,
      description: '固定宽度的 SizedBox'
    },
    'fspacer 弹性空间': {
      snippet: `const Spacer(),`,
      description: '弹性空间'
    },
    'fphysics neverScrollable 禁用滚动物理效果': {
      snippet: `physics: const NeverScrollableScrollPhysics(),`,
      description: '禁用滚动物理效果'
    },
    'fphysics: const BouncingScrollPhysics() iOS效果 弹簧': {
      snippet: `physics: const BouncingScrollPhysics(),`,
      description: '设置滚动物理效果 iOS效果 弹簧'
    },
    'fphysics: const ClampingScrollPhysics() 安卓效果 不弹簧': {
      snippet: `physics: const ClampingScrollPhysics(),`,
      description: '设置滚动物理效果 安卓效果 不弹簧'
    },
    'fscrollDirection horizontal 设置水平滚动方向': {
      snippet: `scrollDirection: Axis.horizontal,`,
      description: '设置水平滚动方向'
    },
    'fshrinkWrap true 设置启用收缩包裹': {
      snippet: `shrinkWrap: true,`,
      description: '设置启用收缩包裹'
    },
    'fbehavior translucent 设置命中测试行为穿透': {
      snippet: `behavior: HitTestBehavior.translucent,`,
      description: '设置命中测试行为穿透'
    },
    'falignment center 设置居中对齐': {
      snippet: `alignment: Alignment.center,`,
      description: '设置居中对齐'
    },
    'fmainAxisAlignment: 设置主轴方式': {
      snippet: `mainAxisAlignment: MainAxisAlignment.start,`,
      description: '设置主轴方式'
    },
    'fcrossAxisAlignment: 设置交叉轴方式': {
      snippet: `crossAxisAlignment: CrossAxisAlignment.start,`,
      description: '设置交叉轴方式'
    },
    'fpostFrameCallback 获取当前帧结束后回调': {
      snippet: `WidgetsBinding.instance.addPostFrameCallback((_) {
  $0
});`,
      description: '获取当前帧结束后回调'
    },
    'fdelayed future延迟执行': {
      snippet: `Future.delayed(const Duration(milliseconds: 1000)).then((value) async {
  $0
});`,
      description: 'future延迟执行'
    },
    'fdelayed await 延迟执行': {
      snippet: `await Future.delayed(const Duration(milliseconds: 1000));`,
      description: 'await 延迟执行'
    },
    'fedgeInsets only 生成间距': {
      snippet: `EdgeInsetsDirectional.only(start: 16.w, end: 16.w, top: 16.w, bottom: 16.w)`,
      description: '生成间距'
    },
    'fedgeInsets all 生成间距': {
      snippet: `EdgeInsetsDirectional.all(16.w)`,
      description: '生成间距'
    },
    'fmargin all 设置外边距': {
      snippet: `margin: EdgeInsetsDirectional.all(16.w)`,
      description: '设置外边距'
    },
    'fmargin only 设置外边距': {
      snippet: `margin: EdgeInsetsDirectional.only(start: 16.w, end: 16.w, top: 16.w, bottom: 16.w)`,
      description: '设置外边距'
    },
    'fpadding all 设置内边距': {
      snippet: `padding: EdgeInsetsDirectional.all(16.w)`,
      description: '设置内边距'
    },
    'fpadding only 设置内边距': {
      snippet: `padding: EdgeInsetsDirectional.only(start: 16.w, end: 16.w, top: 16.w, bottom: 16.w)`,
      description: '设置内边距'
    },
    'ftop 设置顶部': {
      snippet: `top: 16.w,`,
      description: '设置顶部'
    },
    'fstart 设置开始边': {
      snippet: `start: 16.w,`,
      description: '设置开始边'
    },
    'fbottom 设置底部': {
      snippet: `bottom: 16.w,`,
      description: '设置底部'
    },
    'fend 设置结束边': {
      snippet: `end: 16.w,`,
      description: '设置结束边'
    },
    'fcolor 设置红色': {
      snippet: `color: Colors.red,`,
      description: '设置红色'
    },
    'fcolor 设置绿色': {
      snippet: `color: Colors.green,`,
      description: '设置绿色'
    },
    'fcolor 设置蓝色': {
      snippet: `color: Colors.blue,`,
      description: '设置蓝色'
    },
    'fcolor 设置黄色': {
      snippet: `color: Colors.yellow,`,
      description: '设置黄色'
    },
    'fchild text 设置子组件 文本': {
      snippet: `child: Text('Hello World'),`,
      description: '设置子组件 文本'
    },
    'ftext 默认多行': {
      snippet: `Text(
  '多行文本',
  style: TextStyle(
    fontSize: 15.sp,
    fontFamily: 'PingFang SC',
    fontWeight: FontWeight.w500,
    color: const Color(0xFF2A2F3C),
    height: 1.2,
  ),
),`,
      description: '生成文本组件'
    },
    'ftext 单行居中': {
      snippet: `Text(
  '单行文本垂直居中',
  style: TextStyle(
    fontFamily: 'PingFang SC',
    fontWeight: FontWeight.w500,
    color: const Color(0xFF2A2F3C),
  ),
  strutStyle: StrutStyle(
    fontSize: 14.sp,
    height: 1.2,
    forceStrutHeight: true,
  ),
),`,
      description: '生成文本组件'
    },
    'fstrut style 单行居中': {
      snippet: `strutStyle: StrutStyle(
  fontSize: 14.sp,
  height: 1.2,
  forceStrutHeight: true,
),`,
      description: '生成文本组件'
    },
    'fstyle: 设置样式': {
      snippet: `style: TextStyle(
  fontSize: 15.sp,
  fontFamily: 'PingFang SC',
  fontWeight: FontWeight.w500,
  color: const Color(0xFF2A2F3C),
  height: 1.2,
),`,
      description: '设置样式'
    },
    'frichText 生成富文本': {
      snippet: `RichText(
  textAlign: TextAlign.center,
  text: TextSpan(
    style: TextStyle(
      color: const Color(0xFF202020),
      fontSize: 13.sp,
      fontWeight: FontWeight.normal,
      height: 1.2,
    ),
    children: [
      const TextSpan(text: '当前系统检测到'),
      WidgetSpan(alignment: PlaceholderAlignment.middle,child: SizedBox(width: 2.w)),
      TextSpan(text: '4',
        style: TextStyle(color: const Color(0xFFFF7C42)),
        recognizer: TapGestureRecognizer()
          ..onTap = () {
            debugPrint('点击了');
          },
      ),
      WidgetSpan(alignment: PlaceholderAlignment.middle, child: SizedBox(width: 2.w),),
      TextSpan(text: '张图片不符合标准，建议您重新上传'),
    ],
  ),
),`,
      description: '生成富文本'
    },
    'foverlay 添加悬浮窗口': {
      snippet: `OverlayState? overlayState = Overlay.of(context);
controller.overlayEntry = OverlayEntry(
  builder: (context) {
    return PositionedDirectional(
      top: 200.w,
      start: 200.w,
      width: 100.w,
      height: 100.w,
      child: const Text('悬浮窗口'),
    );
  },
);
overlayState.insert(controller.overlayEntry!);`,
      description: '添加悬浮窗口'
    },
    'fpush Widget 打开界面': {
      snippet: `Navigator.of(context).push(MaterialPageRoute(builder: (context) => $0),);`,
      description: '打开界面'
    },
    'fpush Widget 打开弹起界面': {
      snippet: `Navigator.of(context).push(MaterialPageRoute(builder: (context) => $0,fullscreenDialog: true,));`,
      description: '打开弹起界面'
    },
    'fpop 关闭界面': {
      snippet: `if (mounted) Navigator.maybeOf(context)?.pop();`,
      description: '关闭界面'
    },
    'fpop 关闭界面并传递数据': {
      snippet: `if (mounted) Navigator.maybeOf(context)?.pop(data);`,
      description: '关闭界面并传递数据'
    },
    'fgetx init 初始化': {
      snippet: `@override
void onInit() {
  super.onInit();
}`,
      description: 'get 初始化'
    },
    'fgetx ready 初始化后一帧': {
      snippet: `@override
void onReady() {
  super.onReady();
}`,
      description: 'get 初始化后一帧'
    },
    'fgetx close 关闭销毁': {
      snippet: `@override
void onClose() {
  super.onClose();
}`,
      description: 'get 关闭销毁'
    },
    'fget Application Cache Directory 沙盒路径': {
      snippet: `final directory = await getApplicationCacheDirectory();
debugPrint('沙盒路径: \${directory.path}');`,
      description: 'App沙盒路径'
    },
    'ftimer periodic 定时器': {
      snippet: `final periodicTimer = Timer.periodic(const Duration(seconds: 3), (timer) {
  debugPrint('定时器');
});`,
      description: '定时器'
    },
    'fisIOS 判断是否为iOS': {
      snippet: `Platform.isIOS`,
      description: '判断是否为iOS'
    },
    'fisAndroid 判断是否为Android': {
      snippet: `Platform.isAndroid`,
      description: '判断是否为Android'
    },
    'fdebugPrint 调试打印': {
      snippet: `debugPrint('$${1}');`,
      description: '调试打印'
    },
    'fmap 映射': {
      snippet: `Map<String, dynamic> params = {
  '$${1}': '$${2}',
};`,
      description: '映射'
    },
    'flist 列表': {
      snippet: `List<dynamic> list = [];`,
      description: '列表'
    },
    'fstring s1 字符串': {
      snippet: `String s1 = '';`,
      description: '字符串'
    },
    'fint i1 整数': {
      snippet: `int i1 = -1;`,
      description: '整数'
    },
    'fdouble d1 浮点数': {
      snippet: `double d1 = 0.0;`,
      description: '浮点数'
    },
    'fbool b1 布尔值': {
      snippet: `bool b1 = false;`,
      description: '布尔值'
    },
    'fstatic const String globalString = 全局字符串': {
      snippet: `static const String globalString = '${1}';`,
      description: '全局字符串'
    },
    'fduration 设置持续时间': {
      snippet: `duration: const Duration(milliseconds: \$0),`,
      description: '设置持续时间'
    },
    'fduration 表示持续时间': {
      snippet: `Duration(milliseconds: \$0),`,
      description: '表示持续时间'
    },
    'fwidth 设置屏幕宽度': {
      snippet: `width: ScreenUtil().screenWidth,`,
      description: '设置屏幕宽度'
    },
    'fheight 设置屏幕高度': {
      snippet: `height: ScreenUtil().screenWidth,`,
      description: '设置屏幕高度'
    },
    'fbottomPadding 获取底部安全区域': {
      snippet: `ScreenUtil().bottomBarHeight,`,
      description: '获取底部安全区域'
    },
    'ftopPadding 获取顶部安全区域': {
      snippet: `ScreenUtil().statusBarHeight,`,
      description: '获取顶部安全区域'
    },
    'fscreenWidth 获取屏幕宽度': {
      snippet: `ScreenUtil().screenWidth,`,
      description: '获取屏幕宽度'
    },
    'fscreenHeight 获取屏幕高度': {
      snippet: `ScreenUtil().screenHeight,`,
      description: '获取屏幕高度'
    },
    'fsliver adapter with child 适配器': {
      snippet: `SliverAdapter(child: $${1}),`,
      description: 'sliver adapter with child 适配器'
    },
    'ftypedef callback 定义回调': {
      snippet: `typedef Callback = void Function(String msg);`,
      description: '定义回调'
    },
    'ftypedef enum 定义枚举': {
      snippet: `enum LoadingStateEnum { loading, success, error, empty }`,
      description: '定义枚举'
    },
    'fsetState 安全刷新状态': {
      snippet: `if (mounted) setState(() {});`,
      description: '判断是否挂载，并设置状态'
    },
    'frx int': {
      snippet: `final RxInt count = 0.obs;`,
      description: 'getx Rx int类型的状态'
    },
    'frx string': {
      snippet: `final RxString name = ''.obs;`,
      description: 'getx Rx string类型的状态'
    },
    'frx double': {
      snippet: `final RxDouble value = 0.0.obs;`,
      description: 'getx Rx double类型的状态'
    },
    'frx bool': {
      snippet: `final RxBool status = false.obs;`,
      description: 'getx Rx bool类型的状态'
    },
    'fwantKeepAlive 保持状态': {
      snippet: `@override
bool get wantKeepAlive => true;`,
      description: '保持状态'
    },
    'fkey 修饰Class': {
      snippet: `const Class({Key? key}) : super(key: key);`,
      description: 'key修饰Class'
    },
    'fsuper 调用父类': {
      snippet: `super(key: key);`,
      description: '调用父类'
    },
    'fswitch 开关': {
      snippet: `switch ($1) {
  case 0:
    break;
  default:
    break;
}`,
      description: 'switch 开关'
    },
    'fonNotification 滚动通知': {
      snippet: `onNotification: (ScrollNotification notification) {
  if (notification is ScrollStartNotification) {
    debugPrint('开始滚动');
  } else if (notification is ScrollUpdateNotification) {
    // debugPrint('正在滚动');
  } else if (notification is ScrollEndNotification) {
    debugPrint('结束滚动');
  } else {}
  double progress = notification.metrics.pixels / notification.metrics.maxScrollExtent;
  String progressPercentage = '\${(progress * 100).toInt()}%';

  // 返回 false 表示不处理滚动事件,会继续向上传递
  return false;
},`,
      description: 'onNotification 滚动通知'
    },
    'fonNotification 用户触摸': {
      snippet: `onNotification: (ScrollNotification notification) {
if (notification is UserScrollNotification) {
  if (notification.direction == ScrollDirection.reverse ||
      notification.direction == ScrollDirection.forward) {
    controller.startScrollOffset = notification.metrics.pixels;
    controller.isEffectiveScroll = true;
    //用户开始触摸滚动
  } else if (notification.direction == ScrollDirection.idle) {
    //用户触摸停止,确保停止只走一次,防止未吸顶时多次回调
    if (controller.isEffectiveScroll) {
      controller.isEffectiveScroll = false;
      double finalOffset = notification.metrics.pixels;
      String offset = (finalOffset - controller.startScrollOffset).abs().toStringAsFixed(2);
      String direction = finalOffset > controller.startScrollOffset ? 'down' : 'up';
    }
  }
}
// 返回 false 表示不处理滚动事件,会继续向上传递
return false;
},`,
      description: 'onNotification 用户触摸'
    },
    'fimage.file 图片': {
      snippet: `Image.file(
  File('assets/images/flutter_logo.png'),
  fit: BoxFit.contain,
  width: 100.w,
  height: 100.w,
)`,
      description: 'Image.file 图片'
    },
    'fline 左右分割线': {
      snippet: `Container(width: 0.5.w, color: const Color(0xFFE8EAEF)),`,
      description: 'line 左右分割线'
    },
    'fline 上下分割线': {
      snippet: `Container(height: 0.5.w, color: const Color(0xFFE8EAEF)),`,
      description: 'line 上下分割线'
    },
    'ficon 系统图标': {
      snippet: `const Icon(Icons.add),`,
      description: 'icon 系统图标'
    },
    'ficon 自定义图标事件': {
      snippet: `IconButton(
  icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
  onPressed: () => Navigator.of(context).pop(),
)`,
      description: 'icon 自定义图标事件'
    },
    'fscaffold 生成页面': {
      snippet: `Scaffold(
  extendBodyBehindAppBar: false,
  appBar: AppBar(
    title: const Text('标题', style: TextStyle(color: Colors.white)),
    leading: IconButton(
      icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
      onPressed: () => Navigator.of(context).pop(),
    ),
    elevation: 0,
    systemOverlayStyle: SystemUiOverlayStyle.light,
    backgroundColor: Colors.blue,
  ),
  backgroundColor: const Color(0xFFF0F0F0),
  body: Container(),
)`, description: 'scaffold 生成页面'
    },
    'flistview builder 列表': {
      snippet: `ListView.builder(
  padding: EdgeInsetsDirectional.zero,
  scrollDirection: Axis.vertical,
  shrinkWrap: true,
  // physics: const NeverScrollableScrollPhysics(),
  itemCount: 3,
  itemExtent: 60.w,
  itemBuilder: (BuildContext context, int index) {
    return Container(
      child: Text('$index'),
    );
  },
)`, description: 'listview builder 列表'
    },
    'flistview separated 列表': {
      snippet: `ListView.separated(
  padding: EdgeInsetsDirectional.zero,
  scrollDirection: Axis.vertical,
  shrinkWrap: true,
  // physics: const NeverScrollableScrollPhysics(),
  itemCount: 3,
  separatorBuilder: (BuildContext context, int index) {
    return Container(
      width: 0.5.w,
      color: const Color(0xFFE8EAEF),
    );
  },
  itemBuilder: (BuildContext context, int index) {
    return Container(
      child: Text('$index'),
    );
  },
)`, description: 'listview separated 列表'
    },
    'fgridview builder 固定列数,自动撑开高度': {
      snippet: `GridView.builder(
  scrollDirection: Axis.vertical,
  physics: const NeverScrollableScrollPhysics(),
  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,
    mainAxisSpacing: 12.w,
    crossAxisSpacing: 12.w,
    mainAxisExtent: 38.w,
  ),
  itemCount: 15,
  itemBuilder: (BuildContext context, int index) {
    return Container(
      child: Text('$index'),
    );
  },
)`, description: 'gridview builder 固定列数,自动撑开高度'
    },
    'fgridview builder 固定宽度,需要计算高度': {
      snippet: `GridView.builder(
  scrollDirection: Axis.vertical,
  physics: const NeverScrollableScrollPhysics(),
  gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
    maxCrossAxisExtent: 80.w,
    mainAxisSpacing: 7.w,
    crossAxisSpacing: 7.w,   
    childAspectRatio: 1,
    // mainAxisExtent: 100.w,
  ),
  itemCount: 15,
  itemBuilder: (BuildContext context, int index) {
    return Container(
      child: Text('$index'),
    );
  },
)`, description: 'gridview builder 固定宽度,自动撑开高度'
    },
    'fgridview 固定宽度,自动撑开高度': {
      snippet: `GridView(
  shrinkWrap: true,
  gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
    maxCrossAxisExtent: 80.w,
    mainAxisSpacing: 7.w,
    crossAxisSpacing: 7.w,   
    childAspectRatio: 1,
    // mainAxisExtent: 100.w,
  ),
  children: List.generate(
    15,
    (index) {
      return Container(
        child: Text('$index'),
      );
  },
  ),
)`, description: 'gridview 固定宽度,自动撑开高度'
    },
    'fwrap 自动换行': {
      snippet: `Wrap(
  direction: Axis.horizontal,
  runSpacing: 20.w,
  spacing: 20.w,
  alignment: WrapAlignment.start,
  children: List.generate(
    5,
    (index) {
      return Container(
        child: Text('$index'),
      );
  },
)`, description: 'wrap 自动换行'
    },
    'flist generate 循环生成Widget数组': {
      snippet: `List.generate(
  15,
  (index) {
    return Container(
      child: Text('$index'),
    );
  },
)`, description: 'list generate 循环生成Widget数组'
    },
    'fdecoration 设置修饰': {
      snippet: `decoration: BoxDecoration(
  color: Colors.white,
  border: Border.all(width: 1.w, color: const Color(0xFF999999)),
  borderRadius: BorderRadius.all(Radius.circular(8.w)),
),`, description: 'decoration 设置修饰边框'
    },
    'fconstraints 设置约束': {
      snippet: `constraints: BoxConstraints(
  maxWidth: 100.w,
),`,
      description: 'constraints 设置约束'
    },
    'fborder 设置全部边框': {
      snippet: `border: Border.all(width: 1.w, color: Color(0xFF333333)),`,
      description: 'border 设置全部边框'
    },
    'fborder 设置各个边框': {
      snippet: `border: BorderDirectional(
  top: BorderSide(width: 1.w, color: Color(0xFFE5E4E3)),
  bottom: BorderSide(width: 1.w, color: Color(0xFFE5E4E3)),
  start: BorderSide(width: 1.w, color: Color(0xFFE5E4E3)),
  end: BorderSide(width: 1.w, color: Color(0xFFE5E4E3)),
),`,
      description: 'border 设置各个边框'
    },
    'fborderRadius 设置全部圆角': {
      snippet: `borderRadius: BorderRadius.circular(4.w),`,
      description: 'borderRadius 设置全部圆角'
    },
    'fborderRadius 设置单个圆角': {
      snippet: `borderRadius: BorderRadiusDirectional.only(
  topStart: Radius.circular(4.w),
  topEnd: Radius.circular(4.w),
  bottomStart: Radius.circular(4.w),
  bottomEnd: Radius.circular(4.w),
),`,
      description: 'borderRadius 设置单个圆角'
    },
    'fbox gradient 设置线性渐变': {
      snippet: `gradient: LinearGradient(
  begin: Alignment.topCenter,
  end: Alignment.bottomCenter,
  colors: [
    Color(0xFF5E4FF5),
    Color(0xFF58A9F7),
  ],
),`,
      description: 'box gradient 设置线性渐变'
    },
    'fbox shadow 设置阴影': {
      snippet: `boxShadow: [
  BoxShadow(
    color: Color(0x0D000000),
    offset: Offset(0.0, 0.0),
    blurRadius: 5.0,
    spreadRadius: 0.0,
  ),
],`,
      description: 'box shadow 设置阴影'
    },
    'fbox image 设置本地图片': {
      snippet: `image: DecorationImage(
  image: AssetImage('assets/images/flutter_logo.png'),
  fit: BoxFit.cover,
),`,
      description: 'box image 设置本地图片'
    },
    'fbox url 设置网络图片': {
      snippet: `image: DecorationImage(
  image: NetworkImage('https:images/flutter_logo.png'),
  fit: BoxFit.cover,
),`,
      description: 'box url 设置网络图片'
    },
    'fbox shape 设置形状': {
      snippet: `shape: BoxShape.circle,`,
      description: 'box shape 设置形状'
    },
    'fshow bottom sheet 展示底部弹窗': {
      snippet: `showModalBottomSheet(
  context: context,
  isDismissible: true,
  enableDrag: true,
  isScrollControlled: true,
  backgroundColor: Colors.transparent,
  builder: (context) {
    return Container(height: 200.w,);
  },
);`,
      description: 'showModalBottomSheet 展示底部弹窗'
    },
    'fshow dialog 展示中心弹窗': {
      snippet: `showDialog(
  context: context,
  builder: (context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.w)),
      child: Container(
        width: 200.w,
        height: 200.w,
        child: Text('弹窗'),
      ),
    );
  },
);`,
      description: 'showDialog 展示中心弹窗'
    },
    'fanimation 动画声明': {
      snippet: `late AnimationController controller;
late Animation<double> animation;`,
      description: '动画声明'
    },
    'fanimation 动画初始化': {
      snippet: `AnimationController(
  vsync: this,
  duration: const Duration(milliseconds: 1000),
  ..addListener(() {})
  ..addStatusListener((status) {});
animation = Tween(begin: 0.0, end: 1.0)
    .chain(
      CurveTween(
        curve: const Interval(0.1, 0.9),
      ),
    )
    .animate(controller);

    //Animation<int>  int类型的动画  IntTween(begin: 0,end: 200).animate(_container);
    //Animation<Color>  颜色渐变的动画  ColorTween(begin: Colors.grey,end: Colors.red).animate(_container);
    //Animation<int>  反转动画  ReverseTween(IntTween(begin: 0,end: 200)).animate(_container);
    //Animation<Size>  size类型的动画  SizeTween(begin: Size(100,100),end: Size(200,200)).animate(_container);
    //Animation<Rect>  Rect类型动画  RectTween(begin: Rect.fromLTRB(100,100,100,100),end: Rect.fromLTRB(100,100,100,100)).animate(_container);
    //Animation<int>  步数动画  StepTween(begin: _stepNum,end: 0).animate(_container);
    //Animation<int>  常量值动画  ConstantTween<int>(5).animate(_container);
    `,
      description: '动画'
    },
    'frandom int 随机数': {
      snippet: `Random().nextInt(100)`,
      description: '随机数'
    },
    'frandom color 随机颜色': {
      snippet: `Color.fromARGB(
  255,
  Random().nextInt(256),
  Random().nextInt(256),
  Random().nextInt(256),
)`,
      description: '随机颜色'
    },
    'fnested 嵌套': {
      snippet: `NestedScrollView(
  headerSliverBuilder: (context, innerBoxIsScrolled) {
    return [
      SliverAppBar(
        title: Text('NestedScrollView'),
      ),
      SliverPersistentHeader(
        pinned: true,
        delegate: CommonSliverPersistentHeaderDelegate(
          minHeight: 60,
          maxHeight: 200,
          child: Container(
            color: Colors.purple,
          ),
        ),
      ),
    ];
  },
  body: ListView.builder(
    padding: EdgeInsetsDirectional.zero,
    scrollDirection: Axis.vertical,
    itemCount: 30,
    itemExtent: 100,
    itemBuilder: (BuildContext context, int index) {
      return Container(
        color: Colors.green,
        child: Text('$index'),
      );
    },
  ),
)`,
      description: 'nested 嵌套'
    },
    'fnested delegate 自定义': {
      snippet: `class CommonSliverPersistentHeaderDelegate extends SliverPersistentHeaderDelegate {
  final double minHeight;
  final double maxHeight;
  final Widget child;
  CommonSliverPersistentHeaderDelegate({
    required this.minHeight,
    required this.maxHeight,
    required this.child,
  });
  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return child;
  }
  @override
  double get maxExtent => maxHeight;
  @override
  double get minExtent => minHeight;
  @override
  bool shouldRebuild(CommonSliverPersistentHeaderDelegate oldDelegate) {
    return minHeight != oldDelegate.minHeight || maxHeight != oldDelegate.maxHeight || child != child;
  }
}`,
      description: 'nested delegate 自定义'
    },
    'fnested 吸顶': {
      snippet: `NestedScrollView(
  headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
    double topWeightH = 50;
    double middleWeightH = 100;
    return <Widget>[
      SliverAppBar(
        pinned: true,
        floating: true,
        elevation: 0,
        expandedHeight: topWeightH + middleWeightH,
        automaticallyImplyLeading: false,
        backgroundColor: Colors.green,
        flexibleSpace: FlexibleSpaceBar(
          collapseMode: CollapseMode.pin,
          background: Container(
            padding: EdgeInsetsDirectional.only(bottom: middleWeightH),
            color: Colors.green,
            alignment: Alignment.center,
            child: const Text('第一排文案'),
          ),
        ),
        bottom: PreferredSize(
          preferredSize: Size(double.infinity, middleWeightH),
          child: Container(
            height: middleWeightH,
            color: Colors.yellow,
            alignment: Alignment.center,
            child: const Text('第二排文案'),
          ),
        ),
      )
    ];
  },
  body: ListView.builder(
    padding: EdgeInsetsDirectional.zero,
    scrollDirection: Axis.vertical,
    addAutomaticKeepAlives: false,
    addRepaintBoundaries: false,
    shrinkWrap: true,
    physics: const NeverScrollableScrollPhysics(),
    itemCount: 20,
    itemExtent: 80,
    itemBuilder: (BuildContext context, int index) {
      return Container(
        child: const Text('index'),
      );
    },
  ),`,
      description: 'nested 吸顶'
    },
    'fpreferredSize 自定义': {
      snippet: `PreferredSize(
  preferredSize: Size(double.infinity, 55),
  child: Container(
    color: Colors.green,
    child: const Text('PreferredSize'),
  ),
),`,
      description: 'preferredSize 自定义'
    },
    'fimport material 材料': {
      snippet: `import 'package:flutter/material.dart';`,
      description: 'material 材料'
    },
    'fimport foundation 基础': {
      snippet: `import 'package:flutter/foundation.dart';`,
      description: 'foundation 基础'
    },
    'fimport dart:convert 转换': {
      snippet: `import 'dart:convert' as convert;`,
      description: 'dart:convert 转换'
    },
    'fimport dart:math 数学': {
      snippet: `import 'dart:math' as math;`,
      description: 'dart:math 数学'
    },
    'fimport dart:io 文件': {
      snippet: `import 'dart:io' as io;`,
      description: 'dart:io 文件'
    },
    'fimport dart:async 异步': {
      snippet: `import 'dart:async' as async;`,
      description: 'dart:async 异步'
    },
    'fimport dart:typed_data 类型数据': {
      snippet: `import 'dart:typed_data' as typed_data;`,
      description: 'dart:typed_data 类型数据'
    },
    'fimport dart:html 网页': {
      snippet: `import 'dart:html' as html;`,
      description: 'dart:html 网页'
    },
    'fimport dart:svg 矢量图': {
      snippet: `import 'dart:svg' as svg;`,
      description: 'dart:svg 矢量图'
    },
    'fimport dart:ui 界面': {
      snippet: `import 'dart:ui' as ui;`,
      description: 'dart:ui 界面'
    },
    'fimport getx 引入': {
      snippet: `import 'package:get/get.dart';`,
      description: 'getx 引入'
    },
    'fsingleton 单例': {
      snippet: `class Singleton {
  // 私有的命名构造函数
  Singleton._internal();
  // 工厂模式 : 单例公开访问点
  static final Singleton _instance = Singleton._internal();
  factory Singleton() => _instance;
  static Singleton get instance => _instance;
}`,
      description: 'singleton 单例'
    },
    'fglobalkey 初始化': {
      snippet: `final GlobalKey globalKey = GlobalKey();`,
      description: 'globalKey 全局key'
    },
    'fglobalkey 获取widget': {
      snippet: `globalKey.currentWidget`,
      description: 'globalKey 获取widget'
    },
    'fglobalkey 获取state': {
      snippet: `State globalState = _globalKey.currentState as State;`,
      description: 'globalkey 获取state'
    },
    'fglobalkey 获取height': {
      snippet: `var renderBox = globalKey.currentContext?.findRenderObject() as RenderBox;
double dy = renderBox.localToGlobal(Offset.zero).dy;
double height = renderBox.size.height;`,
      description: 'globalKey 获取height'
    },
    'fglobalkey 获取width': {
      snippet: `var renderBox = globalKey.currentContext?.findRenderObject() as RenderBox;
double dx = renderBox.localToGlobal(Offset.zero).dx;
double width = renderBox.size.width;`,
      description: 'globalKey 获取width'
    },
    'fwhile 循环': {
      snippet: `int i = 0;
while (i < 10) {
    print(i);
    i++;
}`,
      description: 'while 循环'
    },
    'ffor 循环': {
      snippet: `for (int i = 0; i < 10; i++) {
    print(i);
}`,
      description: 'for 循环'
    },
    'fvoid 方法': {
      snippet: `void function() {$0}`,
      description: 'void 方法'
    },
    'fchannel method 通道': {
      snippet: `static const MethodChannel _channel = MethodChannel('work_channel');`,
      description: 'channel method通道'
    },
    'fchannel pop 退出app安卓': {
      snippet: `SystemNavigator.pop();`,
      description: 'channel 退出app安卓'
    },
    'fchannel cancel keyboard 取消键盘': {
      snippet: `SystemChannels.textInput.invokeMethod('TextInput.hide');`,
      description: '取消键盘'
    },
    'fvalue notifier 不为空': {
      snippet: `ValueNotifier<int> lister = ValueNotifier<int>(0);`,
      description: 'value notifier 不为空'
    },
    'fvalue notifier 为空': {
      snippet: `ValueNotifier<int?> lister = ValueNotifier<int?>(null);`,
      description: 'value notifier 为空'
    },
    'fjsonkey 不包含': {
      snippet: `@JsonKey(includeFromJson: false, includeToJson: false)`,
      description: 'jsonKey 不包含'
    },
    "fjsonkey string 重命名": {
      snippet: `@JsonKey(name: 'content', defaultValue: '')
final String content;`,
      description: 'jsonKey string 重命名'
    },
    "fjsonkey int 重命名": {
      snippet: `@JsonKey(name: 'count', defaultValue: 0)
final int count;`,
      description: 'jsonKey int 重命名'
    },
    "fjsonkey double 重命名": {
      snippet: `@JsonKey(name: 'size', defaultValue: 0.0)
final double size;`,
      description: 'jsonKey double 重命名'
    },
    "fjsonkey bool 重命名": {
      snippet: `@JsonKey(name: 'isShow', defaultValue: false)
final bool isShow;`,
      description: 'jsonKey bool 重命名'
    },
    "fjsonkey list 重命名": {
      snippet: `@JsonKey(name: 'list', defaultValue: [])
final List<String> list;`,
      description: 'jsonKey list 重命名'
    },
    "fjsonkey map 重命名": {
      snippet: `@JsonKey(name: 'map', defaultValue: {})
final Map<String, dynamic> map;`,
      description: 'jsonKey map 重命名'
    },
    'fjson with class 生成': {
      snippet: `import 'package:json_annotation/json_annotation.dart';

part '$${1}.g.dart';

@JsonSerializable()
class $${1} {
  @JsonKey(name: 'content', defaultValue: '')
  final String content;

  $${1}(this.content);

  factory $${1}.fromJson(Map<String, dynamic> json) => _$$${1}FromJson(json);
  Map<String, dynamic> toJson() => _$$${1}ToJson(this);
}`,
      description: 'json with class 生成'
    },
    'fdebounce 防抖': {
      snippet: `EasyThrottle.throttle(hashCode.toString(), const Duration(milliseconds: 500), () async {
  $1
});`,
      description: 'debounce 防抖'
    },
    'fimage assets package 图片': {
      snippet: `Assets.images.$1.image(width: 24.w, height: 24.w)`,
      description: 'image assets package 图片'
    },
    'fcopy 复制': {
      snippet: `Clipboard.setData(ClipboardData(text: '测试复制'));`,
      description: 'copy 复制'
    },
    'ftoast 吐司': {
      snippet: `ToastUtil.showTip('测试提示');`,
      description: 'toast 吐司'
    },
    'ffeed back 反馈': {
      snippet: `if (Platform.isIOS) {
  HapticFeedback.lightImpact();
} else if (Platform.isAndroid) {
  HapticFeedback.vibrate(duration: 30, amplitude: 128);
}`,
      description: 'feed back 反馈'
    },
    'frtl directionality RTL布局': {
      snippet: `Directionality(
  textDirection: TextDirection.rtl,
  child: $0,
)`,
      description: 'RTL directionality RTL布局'
    },
    'fltr directionality LTR布局': {
      snippet: `Directionality(
  textDirection: TextDirection.ltr,
  child: $0,
)`,
      description: 'LTR directionality LTR布局'
    },
    'flocale 阿拉伯语区域设置': {
      snippet: `Locale('ar', 'SA')`,
      description: 'Arabic locale 阿拉伯语区域设置'
    },
    'flocale 英语区域设置': {
      snippet: `Locale('en', 'US')`,
      description: 'English locale 英语区域设置'
    },
    'fintl bidi 双向文本': {
      snippet: `import 'package:intl/intl.dart' as intl;

String getBidiText(String text) {
  return intl.Bidi.stripHtmlIfNeeded(text);
}`,
      description: 'intl bidi 双向文本处理'
    },
  };

  // 预处理的补全项缓存
  private static preprocessedItems: vscode.CompletionItem[] | null = null;
  private completionItemCache: Map<string, vscode.CompletionItem[]> = new Map();
  private lastWord: string = '';
  private readonly cacheTimeout: number = 5000;

  constructor() {
    // 在构造函数中预处理所有代码片段
    if (!SnippetManager.preprocessedItems) {
      this.preprocessSnippets();
    }
  }

  // 预处理所有代码片段
  private preprocessSnippets() {
    SnippetManager.preprocessedItems = Object.entries(this.snippets).map(([key, value]) => {
      const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Snippet);
      item.detail = value.description;
      item.documentation = new vscode.MarkdownString(value.description);

      // 使用 getter 延迟创建 SnippetString
      Object.defineProperty(item, 'insertText', {
        get: () => new vscode.SnippetString(value.snippet),
        enumerable: true,
        configurable: true
      });

      return item;
    });
  }

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CompletionItem[]> {
    if (token.isCancellationRequested) {
      return [];
    }

    const word = this.getWordAtPosition(document, position);

    // 使用缓存
    if (word === this.lastWord && this.completionItemCache.has(word)) {
      return this.completionItemCache.get(word);
    }

    // 如果输入为空，返回所有预处理的项
    if (!word) {
      return SnippetManager.preprocessedItems;
    }

    // 使用正则表达式快速过滤
    const searchRegex = new RegExp(word, 'i');
    const filteredItems = SnippetManager.preprocessedItems!.filter(
      item => searchRegex.test(item.label as string)
    );

    // 更新缓存
    this.lastWord = word;
    this.completionItemCache.set(word, filteredItems);

    // 设置缓存过期
    setTimeout(() => {
      this.completionItemCache.delete(word);
    }, this.cacheTimeout);

    return filteredItems;
  }

  // 优化获取单词的方法
  private getWordAtPosition(document: vscode.TextDocument, position: vscode.Position): string {
    const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z0-9_\-]+/);
    return wordRange ? document.getText(wordRange) : '';
  }

  // 优化快速选择显示
  private async showSnippetQuickPick() {
    // 使用预处理的项来创建快速选择项
    const quickPickItems = SnippetManager.preprocessedItems!.map(item => ({
      label: item.label as string,
      description: item.detail
    }));

    const selectedSnippet = await vscode.window.showQuickPick(
      quickPickItems,
      {
        placeHolder: '选择要插入的代码片段',
        matchOnDescription: true,
        matchOnDetail: true
      }
    );

    if (selectedSnippet) {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const snippet = this.snippets[selectedSnippet.label].snippet;
        editor.insertSnippet(new vscode.SnippetString(snippet));
      }
    }
  }

  registerCommands(context: vscode.ExtensionContext) {
    // 注册命令
    context.subscriptions.push(
      vscode.commands.registerCommand('extension.insertSnippet', () => {
        this.showSnippetQuickPick();
      })
    );

    // 注册自动完成提供者
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'dart' },
        this
      )
    );
  }

  dispose() {
    this.completionItemCache.clear();
    SnippetManager.preprocessedItems = null;
  }
}
