---
description: 10 — GUI / Screen 开发
---

# 10 — GUI / Screen 开发

> 适用版本：Fabric 1.14.4

---

## 约束

### 核心原则

- GUI 代码**仅在客户端**执行（`ClientModInitializer`）
- Screen 类继承 `Screen` 或其子类
- Screen 通过 `ScreenRegistry` 注册
- **禁止**在服务端引用任何 GUI 类

---

## Decision Flow

### Decision: 选择 GUI 框架

```
IF 简单的输入界面（文本框）
  → Screen + TextFieldWidget

IF 容器型 GUI（如箱子、熔炉）
  → Screen + HandledContainerScreen + ScreenHandler

IF 使用 Fabric API Screen 模块
  → ScreenApi + HandledContainerScreen
```

---

## 基本 Screen

```java
public class MyScreen extends Screen {
    private final Text title;

    public MyScreen(Text title) {
        super(title);
        this.title = title;
    }

    @Override
    protected void init() {
        // 添加按钮
        addButton(new ButtonWidget(width / 2 - 50, height / 2 + 20, 100, 20,
            new TextComponent("Click Me"), btn -> {
                // 按钮点击逻辑
                this.closeScreen();
            }));

        // 添加文本
        drawString(this.font, "Hello Fabric!", width / 2 - 50, height / 2 - 20, 0xFFFFFF);
    }

    @Override
    public void render(MatrixStack matrices, int mouseX, int mouseY, float delta) {
        this.renderBackground(matrices);
        super.render(matrices, mouseX, mouseY, delta);
    }
}
```

## 注册 Screen

```java
// 在 ClientModInitializer 中注册
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        ScreenRegistry.register(
            ModScreenHandlers.MY_SCREEN_HANDLER,
            MyScreen::new
        );
    }
}
```

## ScreenHandler（服务端数据）

```java
// ScreenHandler 在服务端创建
public class MyScreenHandler extends HandledContainerScreenHandler {
    private final Inventory playerInventory;
    private final Inventory blockInventory;

    public MyScreenHandler(int syncId, PlayerInventory playerInventory, Inventory blockInventory) {
        super(new SimpleNamedContainerProvider(
            (id, inv, player) -> new MyScreenHandler(id, inv, blockInventory),
            new TextComponent("My Block")
        ), syncId);
        this.playerInventory = playerInventory;
        this.blockInventory = blockInventory;
        // ...
    }

    @Override
    public boolean canUse(PlayerEntity player) {
        return blockInventory.canPlayerUse(player);
    }
}

// 注册 ScreenHandler Type
public static final RegistryObject<ContainerType<MyScreenHandler>> MY_SCREEN_HANDLER =
    Registry.register(Registry.MENU,
        new Identifier(MOD_ID, "my_screen"),
        new ContainerType<>(MyScreenHandler::new)
    );
```

## 打开 Screen

```java
// 在服务端触发打开（通过网络包）
public void openScreen(PlayerEntity player) {
    player.openContainer(new SimpleNamedContainerProvider(
        (id, inv, p) -> new MyScreenHandler(id, inv, blockInventory),
        new TextComponent("My Block")
    ));
}
```

## Fabric Screen API（fabric-screen-api-v1）

```groovy
// build.gradle
modImplementation "net.fabric.sdk:fabric-screen-api-v1:1.1.2+build.8"
```

```java
// 使用 Screen API 的 Widget
public class MyWidgetScreen extends Screen {
    private SimpleWidget titleWidget;

    @Override
    protected void init() {
        titleWidget = new SimpleWidget(width / 2, height / 2, new TextComponent("My Title"));
        addChild(titleWidget);
    }
}
```

## 常见错误

- ❌ 在 `onInitialize()` 中注册 `ScreenRegistry` — 服务端崩溃，应在 `ClientModInitializer`
- ❌ 在 Screen 类中直接操作服务端数据 — 应通过 `ScreenHandler` 同步
- ❌ 在 `render()` 方法中创建新对象 — 性能问题，应在 `init()` 中创建
- ❌ `ScreenHandler` 中忘记调用 `putStackInSlot` — 玩家物品栏不显示
- ❌ 在 Screen 中忘记调用 `super.render()` — 背景和子元素不渲染

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-registry` | ScreenHandler 通过 Registry.register() 注册 |
| `mc-item` | 物品可以触发打开 Screen |
| `mc-block` | 方块实体可以提供 ScreenHandler |
| `mc-networking` | 网络包用于打开/关闭 Screen |
