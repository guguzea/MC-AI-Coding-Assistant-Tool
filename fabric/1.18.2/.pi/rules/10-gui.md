---
description: 10 — GUI / Screen 开发
---

# 10 — GUI / Screen 开发

> 适用版本：Fabric 1.18.2

---

## 约束

### 核心原则

- GUI 代码**仅在客户端**执行（`ClientModInitializer`）
- Screen 类继承 `Screen` 或其子类
- Screen 通过 `HandledScreens` 注册
- **禁止**在服务端引用任何 GUI 类

---

## Decision Flow

### Decision: 选择 GUI 框架

```
IF 简单的输入界面（文本框）
  → Screen + TextFieldWidget

IF 容器型 GUI（如箱子、熔炉）
  → Screen + HandlerScreen + Menu

IF 使用 Fabric API Screen 模块
  → ScreenApi + TypedScreenHandlerFactory
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
        addDrawableChild(ButtonWidget.builder(Text.literal("Click Me"), btn -> {
            // 按钮点击逻辑
            this.close();
        }).dimensions(width / 2 - 50, height / 2 + 20, 100, 20).build());

        // 添加文本
        addDrawableChild(new TextWidget(width / 2 - 50, height / 2 - 20, 100, 20,
            Text.literal("Hello Fabric!"), textRenderer));
    }

    @Override
    public void render(DrawContext matrices, int mouseX, int mouseY, float delta) {
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
        HandledScreens.register(
            ModScreenHandlers.MY_SCREEN_HANDLER,
            MyScreen::new
        );
    }
}
```

## ScreenHandler（服务端数据）

```java
// ScreenHandler 在服务端创建
public class MyScreenHandler extends ScreenHandler {
    private final Inventory playerInventory;
    private final Inventory blockInventory;

    public MyScreenHandler(int syncId, PlayerInventory playerInventory, Inventory blockInventory) {
        super(ModScreenHandlers.MY_SCREEN_HANDLER, syncId);
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
public static final RegistrySupplier<ScreenHandlerType<MyScreenHandler>> MY_SCREEN_HANDLER =
    Registry.register(
        Registries.SCREEN_HANDLER,
        new Identifier(MOD_ID, "my_screen"),
        new ScreenHandlerType<>(MyScreenHandler::new)
    );
```

## TypedScreenHandlerFactory（自动同步）

```java
public class MyScreenHandlerFactory implements TypedScreenHandlerFactory<MyScreenHandler.Data> {
    private final Inventory inventory;

    public MyScreenHandlerFactory(Inventory inventory) {
        this.inventory = inventory;
    }

    @Override
    public ScreenHandler createMenu(int syncId, PlayerInventory playerInventory,
                                    PlayerEntity player) {
        return new MyScreenHandler(syncId, playerInventory, inventory);
    }

    @Override
    public Text getDisplayName() {
        return Text.literal("My Block");
    }
}
```

## 打开 Screen

```java
// 在服务端触发打开（通过网络包）
public void openScreen(PlayerEntity player) {
    player.openHandledScreen(
        new MyScreenHandlerFactory(blockEntity.getInventory())
    );
}
```

## Fabric Screen API（fabric-screen-api-v0）

```groovy
modImplementation "net.fabricmc.fabric-api:fabric-screen-api-v1:9.1.1+1.18.2"
```

```java
// 使用 Screen API 的 Widget
public class MyWidgetScreen extends Screen {
    private SimpleNamedWidget titleWidget;

    @Override
    protected void init() {
        titleWidget = addSelectableChild(new SimpleNamedWidget(
            Text.literal("My Title"), width / 2, height / 2
        ));
    }
}
```

## 常见错误

- ❌ 在 `onInitialize()` 中注册 `HandledScreens` — 服务端崩溃，应在 `ClientModInitializer`
- ❌ 在 Screen 类中直接操作服务端数据 — 应通过 `ScreenHandler` 同步
- ❌ 在 `render()` 方法中创建新对象 — 性能问题，应在 `init()` 中创建
- ❌ `ScreenHandler` 中忘记调用 `addPlayerInventory()` — 玩家物品栏不显示
- ❌ 在 Screen 中忘记调用 `super.render()` — 背景和子元素不渲染

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | ScreenHandler 通过 Registry.register() 注册 |
| `mc-item` | 物品可以触发打开 Screen |
| `mc-block` | 方块实体可以提供 ScreenHandler |
| `mc-networking` | 网络包用于打开/关闭 Screen |
