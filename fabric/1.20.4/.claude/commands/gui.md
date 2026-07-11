# Fabric GUI/Screen 开发命令参考

本文件描述 Fabric 1.20.4 平台上进行 GUI（图形用户界面）和 Screen（屏幕）开发时所需掌握的核心 API 和常用命令。

## 核心原则

GUI 代码是纯客户端逻辑，所有 GUI 相关代码只能在 `ClientModInitializer.onInitializeClient()` 中初始化，或者使用 `@Environment(EnvType.CLIENT)` 注解标记。**禁止**在服务端的 `onInitialize()` 中注册 GUI 组件，否则会导致服务端启动时崩溃。Screen 类、渲染器、Widget 都属于客户端专用代码。

## Screen 基础命令

### Screen 类定义命令

创建自定义 Screen 需要继承 `Screen` 或其子类。基本命令：`public class MyScreen extends Screen { public MyScreen(Text title) { super(title); } }`。`title` 参数显示在屏幕顶部。Screen 的核心方法包括：`init()` 初始化屏幕内容，`render(DrawContext, int, int, float)` 渲染屏幕，`tick()` 每 tick 更新逻辑，`keyPressed(int, int, int)` 处理键盘输入，`mouseClicked(double, double, int)` 处理鼠标点击。

### init() 初始化命令

`init()` 方法在屏幕创建时调用，用于添加子元素。基本命令结构：

```java
@Override
protected void init() {
    // 添加按钮
    addDrawableChild(ButtonWidget.builder(Text.literal("Click"), btn -> {
        // 按钮点击回调
    }).dimensions(x, y, width, height).build());
    
    // 添加文本
    addDrawableChild(new TextWidget(x, y, width, height, Text.literal("Text"), textRenderer));
    
    // 添加可交互组件
    addSelectableChild(textField);
}
```

使用 `addDrawableChild()` 添加只渲染的组件，`addSelectableChild()` 添加可键盘导航的组件。`textRenderer` 字段是 `TextRenderer` 类型，用于渲染文本。

### render() 渲染命令

`render()` 方法每帧调用，负责绘制屏幕内容。基本命令：

```java
@Override
public void render(DrawContext matrices, int mouseX, int mouseY, float delta) {
    renderBackground(matrices);  // 绘制背景
    super.render(matrices, mouseX, mouseY, delta);  // 绘制子元素
    drawCenteredText(matrices, textRenderer, Text.literal("Title"), width / 2, 20, 0xFFFFFF);
}
```

`DrawContext` 提供多种绘制方法：`fill()` 填充矩形，`drawItem()` 绘制物品图标，`drawSprite()` 绘制精灵图，`drawCenteredText()` 居中绘制文本。`renderBackground()` 自动处理背景（如果游戏启用了背景渲染则显示虚化的游戏画面）。

## HandledScreens 注册命令

### ScreenHandler 关联命令

容器型 GUI（如箱子、熔炉）需要使用 `HandledScreens` 注册 Screen 与 `ScreenHandler` 的关联。基本命令：

```java
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        HandledScreens.register(
            ModScreenHandlers.MY_HANDLER.get(),  // ScreenHandlerType
            MyScreen::new  // Screen 构造函数引用
        );
    }
}
```

第二个参数是 Screen 构造函数引用（`MethodReference`），会传入 `ScreenHandlerContext` 和 `Text` 标题参数。

### ScreenHandler 创建命令

`ScreenHandler` 是服务端数据结构，负责管理容器内容和同步。基本命令：

```java
public class MyScreenHandler extends ScreenHandler {
    private final Inventory inventory;
    
    public MyScreenHandler(int syncId, PlayerInventory playerInventory) {
        super(ModScreenHandlers.MY_HANDLER.get(), syncId);
        this.inventory = // 获取方块或实体的 Inventory
        addPlayerInventory(playerInventory);  // 添加玩家物品栏
    }
    
    @Override
    public boolean canUse(PlayerEntity player) {
        return inventory.canPlayerUse(player);  // 检查玩家是否有权限
    }
}
```

`addPlayerInventory()` 快捷方法将玩家物品栏添加到容器中。

### ScreenHandlerType 注册命令

`ScreenHandler` 需要通过 `ScreenHandlerType` 在服务端注册：

```java
Registry.register(
    Registries.SCREEN_HANDLER,
    new Identifier(MOD_ID, "my_gui"),
    new ScreenHandlerType<>(MyScreenHandler::new, FeatureFlagSet.of())
);
```

`ScreenHandlerType` 的构造函数第一个参数是 ScreenHandler 构造函数引用，第二个参数是所需的功能标签（通常使用 `FeatureFlagSet.of()`）。

## 常用 Widget 命令

### ButtonWidget 按钮命令

创建按钮：`ButtonWidget.builder(Text.literal("Text"), onPress).dimensions(x, y, width, height).build()`。回调 `onPress` 接受 `ButtonWidget` 参数。按钮样式可以通过 `ButtonWidget.ButtonWidgetBuilder` 的其他方法配置：`narrationProvider()` 设置叙述文本，`tooltip(Tooltip)` 设置提示。

### TextFieldWidget 文本框命令

创建可编辑文本框：`new TextFieldWidget(textRenderer, x, y, width, height, Text.literal("Placeholder"))`。需要将焦点管理委托给 Screen：`setFocused(true)` 设置初始焦点，`setSelectable(true)` 允许选择。实现 `Screen.KeyboardNavigation` 接口处理键盘导航。

### SliderWidget 滑块命令

创建数值滑块：`SliderWidget.builder(Text.literal("Value: %s"), value, min, max, step, onChange).dimensions(x, y, width, height).build()`。`onChange` 回调在滑块值改变时调用。

### CyclingButtonWidget 循环按钮命令

创建循环切换按钮：`CyclingButtonWidget.builder(option -> Text.literal(option.toString())).values(options).initially(options[0]).build()`。适用于模式切换、选项选择等场景。

## Text 和样式命令

### Text 创建命令

Fabric 使用 `Text` 接口而不是字符串显示文本。常用创建方法：`Text.literal("String")` 创建纯文本，`Text.translatable("key")` 创建可翻译文本（会查询语言文件），`Text.literal("").append(Text.literal("Part")).formatted(Formatting.RED)` 组合和格式化文本。`Formatting` 提供颜色（`RED`、`GREEN`、`BLUE`）和样式（`BOLD`、`ITALIC`、`STRIKETHROUGH`）。

### TranslatableText 显示命令

对于多语言支持，使用 `TranslatableText`：`Text.translatable("item.examplemod.my_item")` 创建可翻译文本，会根据游戏语言设置自动选择对应文本。需要在语言文件 `assets/{modid}/lang/en_us.json` 中定义翻译键值对。

## 网络同步命令

### 数据同步命令

GUI 中的服务端数据通过 `ScreenHandler` 自动同步。对于自定义同步需求，使用 `PacketByteBuf` 读写数据，通过 `ServerPlayNetworking` 和 `ClientPlayNetworking` 发送数据包。在 `ScreenHandler.readScreenOpeningPacket()` 中处理客户端接收到的数据包，在服务端使用 `ScreenHandler.writeScreenOpeningPacket()` 发送数据。

## Fabric Screen API 命令

引入 `fabric-screen-api-v1` 模块可以获得更高级的 GUI 功能：

```groovy
modImplementation "net.fabricmc.fabric-api:fabric-screen-api-v1:9.1.1+1.20.4"
```

### SimpleNamedWidget 命令

`SimpleNamedWidget` 提供命名的 Widget 便于焦点管理：`addSelectableChild(new SimpleNamedWidget(Text.literal("Name"), x, y, width, height, textRenderer))`。通过 `getName()` 获取 Widget 名称，实现屏幕内的焦点循环。

### ScreenRegistry 通用注册命令

Fabric Screen API 提供了 `ScreenRegistry` 作为 `HandledScreens` 的替代：`ScreenRegistry.register(factory, (syncId, inventory, title) -> new MyScreen(...))`。两者功能等价，选择其一使用即可。

## 打开和关闭 Screen 命令

### openHandledScreen 命令

在服务端触发打开 GUI：`player.openHandledScreen(new NamedScreenHandlerFactory() { ... })`。`NamedScreenHandlerFactory` 需要实现 `createMenu()`、`getDisplayName()` 方法。如果 `createMenu()` 返回 `null`，GUI 不会打开。

### closeScreen 命令

关闭当前 Screen：`client.setScreen(null)` 或调用 Screen 内部的关闭方法。也可以通过发送网络包让服务端通知客户端关闭。
