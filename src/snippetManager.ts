import * as vscode from 'vscode';

interface SnippetInfo {
  snippet: string;
  description: string;
}

export class SnippetManager implements vscode.CompletionItemProvider {
  private snippets: { [key: string]: SnippetInfo } = {
    'sb 固定大小的 SizedBox': {
      snippet: `SizedBox(width: 16.w, height: 16.w),`,
      description: '固定大小的 SizedBox'
    },
    'sbh 固定高度的 SizedBox': {
      snippet: `SizedBox(height: 16.w),`,
      description: '固定高度的 SizedBox'
    },
    'sbw 固定宽度的 SizedBox': {
      snippet: `SizedBox(width: 16.w),`,
      description: '固定宽度的 SizedBox'
    },
    'spacer 弹性空间': {
      snippet: `const Spacer(),`,
      description: '弹性空间'
    },
    'width 宽度': {
      snippet: `width: 100.w,`,
      description: '设置宽度'
    },
    'height 高度': {
      snippet: `height: 100.w,`,
      description: '设置高度'
    },
    'physics neverScrollable 禁用滚动物理效果': {
      snippet: `physics: const NeverScrollableScrollPhysics(),`,
      description: '禁用滚动物理效果'
    },
    'physics: const BouncingScrollPhysics() iOS效果 弹簧': {
      snippet: `physics: const BouncingScrollPhysics(),`,
      description: '设置滚动物理效果'
    },
    'physics: const ClampingScrollPhysics() 安卓效果 不弹簧': {
      snippet: `physics: const ClampingScrollPhysics(),`,
      description: '设置滚动物理效果'
    },
    'scrollDirection horizontal 水平滚动方向': {
      snippet: `scrollDirection: Axis.horizontal,`,
      description: '设置水平滚动方向'
    },
    'shrinkWrap true 启用收缩包裹': {
      snippet: `shrinkWrap: true,`,
      description: '启用收缩包裹'
    },
    'behavior translucent 命中测试行为': {
      snippet: `behavior: HitTestBehavior.translucent,`,
      description: '设置命中测试行为为透明'
    },
    'alignment center 居中对齐': {
      snippet: `alignment: Alignment.center,`,
      description: '居中对齐'
    },
    'mainAxisAlignment: 主轴方式': {
      snippet: `mainAxisAlignment: MainAxisAlignment.spaceBetween,`,
      description: '主轴方式'
    },
    'crossAxisAlignment: 交叉轴方式': {
      snippet: `crossAxisAlignment: CrossAxisAlignment.start,`,
      description: '交叉轴方式'
    },
    'addPostFrameCallback 当前帧结束后回调': {
      snippet: `WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
  '${1}'
});`,
      description: '当前帧结束后回调'
    },
    'delayed future延迟执行': {
      snippet: `Future.delayed(const Duration(milliseconds: 1000)).then((value) async {
  '${1}'
});`,
      description: 'future延迟执行'
    },
    'delayed await延迟执行': {
      snippet: `await Future.delayed(const Duration(milliseconds: 1000));`,
      description: 'await延迟执行'
    },
    'edgeInsets only 间距': {
      snippet: `EdgeInsets.only(left: 16.w, right: 16.w, top: 16.w, bottom: 16.w),`,
      description: '设置单方向的间距'
    },
    'edgeInsets all 间距': {
      snippet: `EdgeInsets.all(16.w),`,
      description: '设置所有方向的间距'
    },
    'margin all 外边距': {
      snippet: `margin: EdgeInsets.all(16.w),`,
      description: '设置所有方向的外边距'
    },
    'margin only 外边距': {
      snippet: `margin: EdgeInsets.only(left: 16.w, right: 16.w, top: 16.w, bottom: 16.w),`,
      description: '设置单方向的外边距'
    },
    'padding all 内边距': {
      snippet: `padding: EdgeInsets.all(16.w),`,
      description: '设置所有方向的内边距'
    },
    'padding only 内边距': {
      snippet: `padding: EdgeInsets.only(left: 16.w, right: 16.w, top: 16.w, bottom: 16.w),`,
      description: '设置单方向的内边距'
    },
    'top 顶部': {
      snippet: `top: 16.w,`,
      description: '设置顶部位置'
    },
    'left 左边': {
      snippet: `left: 16.w,`,
      description: '设置左边位置'
    },
    'bottom 底部': {
      snippet: `bottom: 16.w,`,
      description: '设置底部位置'
    },
    'right 右边': {
      snippet: `right: 16.w,`,
      description: '设置右边位置'
    },
    'color 红色': {
      snippet: `color: Colors.red,`,
      description: '设置颜色为红色'
    },
    'color 绿色': {
      snippet: `color: Colors.green,`,
      description: '设置颜色为绿色'
    },
    'color 蓝色': {
      snippet: `color: Colors.blue,`,
      description: '设置颜色为蓝色'
    },
    'color 黄色': {
      snippet: `color: Colors.yellow,`,
      description: '设置颜色为黄色'
    },
    'child text 文本子组件': {
      snippet: `child: Text('Hello World'),`,
      description: 'child 文本子组件'
    },
    'text 文本组件': {
      snippet: `Text(
  'Hello World',
  style: TextStyle(
    fontSize: 15.sp,
    fontFamily: 'PingFang SC',
    fontWeight: FontWeight.w500,
    color: const Color(0xFF2A2F3C),
    height: 1.3,
  ),
),`,
      description: 'text 文本组件'
    },
    "style: style样式": {
      snippet: `style: TextStyle(
  fontSize: 15.sp,
  fontFamily: 'PingFang SC',
  fontWeight: FontWeight.w500,
  color: const Color(0xFF2A2F3C),
  height: 1.3,
)`,
      description: 'style 样式'
    },
    'richText 富文本': {
      snippet: `RichText(
  textAlign: TextAlign.center,
  text: TextSpan(
    style: TextStyle(
      color: const Color(0xFF202020),
      fontSize: 13.sp,
      fontWeight: FontWeight.normal,
      height: 1.3,
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
)`,
      description: '富文本'
    },
    'overlay 悬浮窗口': {
      snippet: `if (controller.overlayEntry != null) return; // 防止重复插入
OverlayState? overlayState = Overlay.of(context);
controller.overlayEntry = OverlayEntry(
  builder: (context) {
    return Positioned(
      top: 200.w,
      left: 200.w,
      width: 100.w,
      height: 100.w,
      child: const Text('悬浮窗口'),
    );
  },
);
overlayState.insert(controller.overlayEntry!);`,
      description: '悬浮窗口'
    },
    'push 导航': {
      snippet: `Navigator.of(context).push(MaterialPageRoute(builder: (context) => $1),);`,
      description: '导航'
    },
    'push 全屏对话框': {
      snippet: `Navigator.of(context).push(MaterialPageRoute(builder: (context) => $1,fullscreenDialog: true,));`,
      description: '全屏对话框'
    },
    'pop 返回': {
      snippet: `Navigator.maybeOf(context)?.pop();`,
      description: '返回'
    },
    'pop 返回并传递数据': {
      snippet: `Navigator.maybeOf(context)?.pop(data);`,
      description: '返回并传递数据'
    },
    'getx 返回': {
      snippet: `Get.back();`,
      description: 'getx 返回'
    },
    'getx 返回并传递数据': {
      snippet: `Get.back(result: data);`,
      description: 'getx 返回并传递数据'
    },
    'getx find 获取实例': {
      snippet: `if (Get.isRegistered<${1}>()) {
  Get.find<${1}>();
}`,
      description: 'getx find 获取实例'
    },
    "getApplicationCacheDirectory 沙盒路径": {
      snippet: `final directory = await getApplicationCacheDirectory();
debugPrint('沙盒路径: \${directory.path}');`,
      description: '沙盒路径'
    },
    "timer periodic 定时器": {
      snippet: `final periodicTimer = Timer.periodic(const Duration(seconds: 3), (timer) {
  debugPrint('定时器');
});`,
      description: '定时器'
    },
    'unfocus 取消焦点': {
      snippet: `FocusManager.instance.primaryFocus?.unfocus();`,
      description: '取消焦点'
    },
    'debugPrint 调试打印': {
      snippet: `debugPrint('${1}');`,
      description: '调试打印'
    },
    'map 映射': {
      snippet: `Map<String, dynamic> params = {
  '${1}': '${2}',
};`,
      description: '映射'
    },
    'list 列表': {
      snippet: `List<dynamic> list = [];`,
      description: '列表'
    },
    'String s1 字符串': {
      snippet: `String s1 = '${1}';`,
      description: '字符串'
    },
    'int i1 整数': {
      snippet: `int i1 = ${1};`,
      description: '整数'
    },
    'double d1 浮点数': {
      snippet: `double d1 = ${1}.0;`,
      description: '浮点数'
    },
    'bool b1 布尔值': {
      snippet: `bool b1 = ${1};`,
      description: '布尔值'
    },
    'static const String globalString = 全局字符串': {
      snippet: `static const String globalString = '${1}';`,
      description: '全局字符串'
    },
    'duration 持续时间': {
      snippet: `duration: const Duration(milliseconds: '${1}'),`,
      description: '持续时间'
    },
    'Duration 持续时间': {
      snippet: `Duration(milliseconds: '${1}'),`,
      description: '持续时间'
    },
    'width 屏幕宽度': {
      snippet: `width: MediaQuery.of(context).size.width,`,
      description: '获取屏幕宽度'
    },
    'height 屏幕高度': {
      snippet: `height: MediaQuery.of(context).size.height,`,
      description: '获取屏幕高度'
    },
    'bottomPadding 底部安全区域': {
      snippet: `MediaQuery.of(context).padding.bottom,`,
      description: '获取底部安全区域'
    },
    'topPadding 顶部安全区域': {
      snippet: `MediaQuery.of(context).padding.top,`,
      description: '获取顶部安全区域'
    },
    'statusBarHeight 状态栏高度': {
      snippet: `ScreenUtil().statusBarHeight,`,
      description: '获取状态栏高度'
    },
    'bottomBarHeight 底部栏高度': {
      snippet: `ScreenUtil().bottomBarHeight,`,
      description: '获取底部栏高度'
    },
    'screenWidth 屏幕宽度': {
      snippet: `ScreenUtil().screenWidth,`,
      description: '获取屏幕宽度'
    },
    'screenHeight 屏幕高度': {
      snippet: `ScreenUtil().screenHeight,`,
      description: '获取屏幕高度'
    },
    'sliver adapter class 适配器': {
      snippet: `SliverAdapter`,
      description: '适配器'
    },
    'sliver adapter with child 适配器': {
      snippet: `SliverAdapter(child: '${1}'),`,
      description: '适配器'
    },
    'typedef callback 定义回调': {
      snippet: `typedef Callback = void Function(String res);`,
      description: '定义回调'
    },
    'typedef enum 定义枚举': {
      snippet: `enum LoadingStateEnum { loading, success, error, empty }`,
      description: '定义枚举'
    },
    'setState 刷新状态': {
      snippet: `if (mounted) setState(() {});`,
      description: '判断是否挂载，并设置状态'
    },
    'wantKeepAlive 保持状态': {
      snippet: `@override
  bool get wantKeepAlive => true;`,
      description: '保持状态'
    },
    'key 定义key': {
      snippet: `const Class({Key? key}) : super(key: key);`,
      description: '定义key'
    },
    'super 调用父类': {
      snippet: `super(key: key);`,
      description: '调用父类'
    },
    'switch 开关': {
      snippet: `switch ($1) {
  case 0:
    {};
    break;
  default:
    break;
}`,
      description: '开关'
    },
    'onNotification 滚动通知': {
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
      description: '滚动通知'
    },
    'Image.file 图片': {
      snippet: `Image.file(
  fit: BoxFit.contain,
  File('${1}'),
  width: 100.w,
  height: 100.w,
)`,
      description: '图片'
    },
    'line 左右分割线': {
      snippet: `Container(width: 0.5.w, color: const Color(0xFFE8EAEF)),`,
      description: '左右分割线'
    },
    'line 上下分割线': {
      snippet: `Container(height: 0.5.w, color: const Color(0xFFE8EAEF)),`,
      description: '上下分割线'
    },
    'icon 系统图标': {
      snippet: `const Icon(Icons.add),`,
      description: '系统图标'
    },
    'icon 自定义图标事件': {
      snippet: `const IconButton(
  icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
  onPressed: () => Navigator.of(context).pop(),
)`,
      description: '自定义图标事件'
    },
    'scaffold 全屏': {
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
)`, description: '全屏'
    },
    'listview builder 列表': {
      snippet: `ListView.builder(
  padding: EdgeInsets.zero,
  scrollDirection: Axis.vertical,
  addAutomaticKeepAlives: false,
  addRepaintBoundaries: false,
  shrinkWrap: true,
  // physics: const NeverScrollableScrollPhysics(),
  itemCount: 3,
  itemExtent: 60,
  itemBuilder: (BuildContext context, int index) {
    return Container(
      child: Text('$index'),
    );
  },
)`, description: 'builder 列表'
    },
    'listview separated 列表': {
      snippet: `ListView.separated(
  padding: EdgeInsets.zero,
  scrollDirection: Axis.vertical,
  addAutomaticKeepAlives: false,
  addRepaintBoundaries: false,
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
)`, description: 'separated 列表'
    },
    'gridview builder 固定列数,自动撑开高度': {
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
)`, description: 'gridview  固定列数,自动撑开高度'
    },
    'gridview builder 固定宽度,需要计算高度': {
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
)`, description: 'gridview  固定列数,自动撑开高度'
    },
    'gridview builder 固定宽度,自动撑开高度': {
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
)`, description: 'gridview  固定宽度,自动撑开高度'
    },
    'wrap 自动换行': {
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
    'list.generate 生成列表': {
      snippet: `List.generate(
  15,
  (index) {
    return Container(
      child: Text('$index'),
    );
  },
)`, description: 'list.generate 生成列表'
    },
    'decoration 修饰边框': {
      snippet: `decoration: BoxDecoration(
  color: Colors.white,
  border: Border.all(width: 0.5.w, color: const Color(0xFF999999)),
  borderRadius: BorderRadius.all(Radius.circular(8.w)),
),`, description: 'decoration 修饰边框'
    },
    'constraints 约束': {
      snippet: `constraints: BoxConstraints(
  maxWidth: 100.w,
  maxHeight: 100.w,
),`,
      description: '约束'
    },
    'border 全部边框': {
      snippet: `border: Border.all(width: 0.5.w, color: Color(0xFF333333)),`,
      description: '全部边框'
    },
    'border 各个边框': {
      snippet: `border: Border(
  top: BorderSide(width: 0.5.w, color: Color(0xFFE5E4E3)),
  bottom: BorderSide(width: 0.5.w, color: Color(0xFFE5E4E3)),
  left: BorderSide(width: 0.5.w, color: Color(0xFFE5E4E3)),
  right: BorderSide(width: 0.5.w, color: Color(0xFFE5E4E3)),
),`,
      description: '各个边框'
    },
    'borderRadius 全部圆角': {
      snippet: `borderRadius: BorderRadius.circular(4.w),`,
      description: '全部圆角'
    },
    'borderRadius 单个圆角': {
      snippet: `borderRadius: BorderRadius.only(
  topLeft: Radius.circular(4.w),
  topRight: Radius.circular(4.w),
  bottomLeft: Radius.circular(4.w),
  bottomRight: Radius.circular(4.w),
),`,
      description: '单个圆角'
    },
    'box gradient 线性渐变': {
      snippet: `gradient: LinearGradient(
  begin: Alignment(0.91, -0.40),
  end: Alignment(-0.91, 0.4),
  colors: [
    Color(0xFF5E4FF5),
    Color(0xFF5272F4),
    Color(0xFF58A9F7),
  ],
),`,
      description: '线性渐变'
    },
    'box shadow 阴影': {
      snippet: `boxShadow: [
  BoxShadow(
    color: Color(0x0D000000),
    offset: Offset(0.0, 0.0),
    blurRadius: 5.0,
    spreadRadius: 0.0,
  ),
],`,
      description: '阴影'
    },
    'box image 图片': {
      snippet: `image: DecorationImage(
  image: AssetImage('${1}'),
  fit: BoxFit.cover,
),`,
      description: '图片'
    },
    'box url 图片': {
      snippet: `image: DecorationImage(
  image: NetworkImage('${1}'),
  fit: BoxFit.cover,
),`,
      description: '图片'
    },
    'box shape 形状': {
      snippet: `shape: BoxShape.circle,`,
      description: '形状'
    },
    'showModalBottomSheet 底部弹窗': {
      snippet: `showModalBottomSheet(
  context: context,
  isDismissible: true,
  enableDrag: true,
  isScrollControlled: true,
  backgroundColor: Colors.transparent,
  builder: (context) {
    return Container();
  },
);`,
      description: '底部弹窗'
    },
    'showDialog 弹窗': {
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
      description: '弹窗'
    },
    'animation 动画声明': {
      snippet: `late AnimationController controller;
late Animation<double> animation;`,
      description: '动画声明'
    },
    'animation 动画初始化': {
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
    'random 随机数': {
      snippet: `Random random = Random();
int randomNumber = random.nextInt(100);`,
      description: '随机数'
    },
    'random 随机颜色': {
      snippet: `Color randomColor = Color.fromARGB(
  255,
  random.nextInt(256),
  random.nextInt(256),
  random.nextInt(256),
);`,
      description: '随机颜色'
    },
    'nested 嵌套': {
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
    padding: EdgeInsets.zero,
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
      description: '嵌套'
    },
    'nested delegate 自定义': {
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
      description: 'nested 自定义'
    },
    'nested 吸顶': {
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
            padding: EdgeInsets.only(bottom: middleWeightH),
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
    padding: EdgeInsets.zero,
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
    'preferredSize 自定义': {
      snippet: `PreferredSize(
  preferredSize: Size(double.infinity, 55),
  child: Container(
    color: Colors.green,
    child: const Text('PreferredSize'),
  ),
),`,
      description: '自定义'
    },
    'material 材料': {
      snippet: `import 'package:flutter/material.dart';`,
      description: '材料'
    },
    'foundation 基础': {
      snippet: `import 'package:flutter/foundation.dart';`,
      description: '基础'
    },
    'dart:convert 转换': {
      snippet: `import 'dart:convert' as convert;`,
      description: '转换'
    },
    'dart:math 数学': {
      snippet: `import 'dart:math' as math;`,
      description: '数学'
    },
    'dart:io 文件': {
      snippet: `import 'dart:io' as io;`,
      description: '文件'
    },
    'dart:async 异步': {
      snippet: `import 'dart:async' as async;`,
      description: '异步'
    },
    'dart:typed_data 类型数据': {
      snippet: `import 'dart:typed_data' as typed_data;`,
      description: '类型数据'
    },
    'dart:html 网页': {
      snippet: `import 'dart:html' as html;`,
      description: '网页'
    },
    'dart:svg 矢量图': {
      snippet: `import 'dart:svg' as svg;`,
      description: '矢量图'
    },
    'dart:ui 界面': {
      snippet: `import 'dart:ui' as ui;`,
      description: '界面'
    },
    'singleton 单例': {
      snippet: `class Singleton {
  // 私有的命名构造函数
  Singleton._internal();
  // 工厂模式 : 单例公开访问点
  static final Singleton _instance = Singleton._internal();
  factory Singleton() => _instance;
  static Singleton get instance => _instance;
},`,
      description: '单例'
    },
    'globalKey 全局key': {
      snippet: `final GlobalKey globalKey = GlobalKey();`,
      description: '全局key'
    },
    'globalKey 获取widget': {
      snippet: `globalKey.currentWidget`,
      description: '获取widget'
    },
    'globalkey 获取state': {
      snippet: `${1}State globalState = _globalKey.currentState as ${1}State;`,
      description: '获取state'
    },
    'globalKey 获取height': {
      snippet: `var renderBox = globalKey.currentContext?.findRenderObject() as RenderBox;
double dy = renderBox.localToGlobal(Offset.zero).dy;
double height = renderBox.size.height;`,
      description: '获取height'
    },
    'globalKey 获取width': {
      snippet: `var renderBox = globalKey.currentContext?.findRenderObject() as RenderBox;
double dx = renderBox.localToGlobal(Offset.zero).dx;
double width = renderBox.size.width;`,
      description: '获取width'
    },
    'while 循环': {
      snippet: `int i = 0;
while (i < 10) {
    print(i);
    i++;
}`,
      description: 'while 循环'
    },
    'for 循环': {
      snippet: `for (int i = 0; i < 10; i++) {
    print(i);
}`,
      description: 'for 循环'
    },
    'channel 通道': {
      snippet: `static const MethodChannel _channel = MethodChannel('work_channel');`,
      description: '通道'
    },
    'channel 退出app安卓': {
      snippet: `SystemNavigator.pop();`,
      description: '退出app安卓'
    },
    'value notifier 不为空': {
      snippet: `ValueNotifier<int> lister = ValueNotifier<int>(0);`,
      description: 'value notifier'
    },
    'value notifier 为空': {
      snippet: `ValueNotifier<int?> lister = ValueNotifier<int?>(null);`,
      description: 'value notifier 为空'
    },
    'jsonKey 不包含': {
      snippet: `@JsonKey(includeFromJson: false, includeToJson: false)`,
      description: 'jsonKey 不包含'
    },
    "jsonKey string 重命名": {
      snippet: `@JsonKey(name: 'content')
String content = '';`,
      description: 'jsonKey string 重命名'
    },
    "jsonKey int 重命名": {
      snippet: `@JsonKey(name: 'content')
int content = 0;`,
      description: 'jsonKey int 重命名'
    },
    "jsonKey double 重命名": {
      snippet: `@JsonKey(name: 'content')
double content = 0;`,
      description: 'jsonKey double 重命名'
    },
    "jsonKey bool 重命名": {
      snippet: `@JsonKey(name: 'content')
bool content = false;`,
      description: 'jsonKey bool 重命名'
    },
    'jsonSerializable with class 生成': {
      snippet: `import 'package:json_annotation/json_annotation.dart';

part '${1}.g.dart';

@JsonSerializable()
class ${1} {
  @JsonKey(name: 'content')
  String content = '';

  ${1}();

  factory ${1}.fromJson(Map<String, dynamic> json) => _$${1}FromJson(json);
  Map<String, dynamic> toJson() => _$${1}ToJson(this);
}`,
      description: 'jsonSerializable with class 生成'
    },
    'debounce 防抖': {
      snippet: `EasyThrottle.throttle(hashCode.toString(), const Duration(milliseconds: 500), () async {
  $1
});`,
      description: 'debounce 防抖'
    },
    'image assets package 图片': {
      snippet: `Assets.images.$1.image(width: 24.w, height: 24.w)`,
      description: 'image assets package 图片'
    },
    'copy 复制': {
      snippet: `Clipboard.setData(ClipboardData(text: '复制内容'));`,
      description: 'copy 复制'
    },
    'toast 吐司': {
      snippet: `ToastUtil.showTip('复制成功');`,
      description: 'toast 吐司'
    },
    'feed back 反馈': {
      snippet: `if (Platform.isIOS) {
  HapticFeedback.lightImpact();
} else if (Platform.isAndroid) {
  HapticFeedback.vibrate(duration: 30, amplitude: 128);
}`,
      description: 'feed back 反馈'
    },
  };
  registerCommands(context: vscode.ExtensionContext) {
    // 注册命令
    let disposable = vscode.commands.registerCommand('extension.insertSnippet', () => {
      this.showSnippetQuickPick();
    });
    context.subscriptions.push(disposable);

    // 注册自动完成提供者
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'dart' },
        this
      )
    );
  }

  private async showSnippetQuickPick() {
    const selectedSnippet = await vscode.window.showQuickPick(
      Object.entries(this.snippets).map(([key, value]) => ({
        label: key,
        description: value.description
      })),
      { placeHolder: '选择要插入的代码片段' }
    );

    if (selectedSnippet) {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        editor.insertSnippet(new vscode.SnippetString(this.snippets[selectedSnippet.label].snippet));
      }
    }
  }

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.CompletionItem[] {
    const word = this.getWordAtPosition(document, position);

    return Object.entries(this.snippets)
      .filter(([key]) => key.toLowerCase().includes(word.toLowerCase()))
      .map(([key, value]) => {
        const completionItem = new vscode.CompletionItem(key, vscode.CompletionItemKind.Snippet);
        completionItem.insertText = new vscode.SnippetString(value.snippet);
        completionItem.documentation = new vscode.MarkdownString(`${value.description}\n\n\`\`\`dart\n${value.snippet}\n\`\`\``);
        completionItem.detail = value.description;
        completionItem.range = document.getWordRangeAtPosition(position);
        return completionItem;
      });
  }

  private getWordAtPosition(document: vscode.TextDocument, position: vscode.Position): string {
    const range = document.getWordRangeAtPosition(position);
    return range ? document.getText(range) : '';
  }
}
