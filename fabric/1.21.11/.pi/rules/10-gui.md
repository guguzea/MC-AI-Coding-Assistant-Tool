---
description: 10 — GUI / Screen 开发
---

# 10 — GUI / Screen 开发

> 适用版本：Fabric 1.21.11

---

## 约束

### 核心原则

- GUI 代码**仅在客户端**执行（`ClientModInitializer`）
- Screen 类继承 `Screen` 或其子类（容器屏通常再包一层 HandledScreen / ContainerScreen）
- 容器屏通过 `HandledScreens.register` 注册
- **禁止**在服务端引用任何 GUI 类（`Screen`、`ButtonWidget`、`DrawContext` 等）

---

## Decision Flow

### Decision: 选择 GUI 框架

```
IF 简单的输入界面（文本框、按钮、说明）
  → Screen + TextFieldWidget + ButtonWidget

IF 容器型 GUI（箱子、熔炉、机器）
  → HandledScreen + ScreenHandler + NamedScreenHandlerFactory

IF 打开时要同步额外数据（坐标、流体量等）
  → 额外数据：ExtendedScreenHandlerFactory（不要编造 TypedScreenHandlerFactory）

IF 给原版 Screen 加控件
  → ScreenEvents.AFTER_INIT + Screens.getButtons
```

---

## 基本 Screen

按钮在 `init()` 里创建；**标题/说明文字在 `render()` 里画**，不要在 `init()` 里 `drawString`。
不要用 `TextWidget`（部分档没有）或 `SimpleNamedWidget`（编造）。

```java
public class MyScreen extends Screen {
    private final Text title;

    public MyScreen(Text title) {
        super(title);
        this.title = title;
    }

    @Override
    protected void init() {
        addDrawableChild(ButtonWidget.builder(Text.literal("Click Me"), btn -> {
            // 按钮点击逻辑
            this.close();
        }).dimensions(width / 2 - 50, height / 2 + 20, 100, 20).build());
    }

    @Override
    public void render(DrawContext context, int mouseX, int mouseY, float delta) {
        this.renderBackground(context, mouseX, mouseY, delta);
        context.drawText(this.textRenderer, Text.literal("Hello Fabric!"),
            width / 2 - 50, height / 2 - 20, 0xFFFFFF, false);
        super.render(context, mouseX, mouseY, delta);
    }
}
```

## 注册 Screen

```java
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
public class MyScreenHandler extends ScreenHandler {
    private final Inventory playerInventory;
    private final Inventory blockInventory;

    public MyScreenHandler(int syncId, PlayerInventory playerInventory) {
        this(syncId, playerInventory, new SimpleInventory(9));
    }

    public MyScreenHandler(int syncId, PlayerInventory playerInventory, Inventory blockInventory) {
        super(ModScreenHandlers.MY_SCREEN_HANDLER, syncId);
        this.playerInventory = playerInventory;
        this.blockInventory = blockInventory;
        // 给方块槽和玩家物品栏循环 addSlot(...)，没有 addPlayerInventory() 这种原版方法
    }

    @Override
    public boolean canUse(PlayerEntity player) {
        return blockInventory.canPlayerUse(player);
    }

    @Override
    public ItemStack quickMove(PlayerEntity player, int slot) {
        return ItemStack.EMPTY;
    }
}

public static final ScreenHandlerType<MyScreenHandler> MY_SCREEN_HANDLER =
    Registry.register(
        Registries.SCREEN_HANDLER,
        Identifier.of("examplemod", "my_screen"),
        new ScreenHandlerType<>(MyScreenHandler::new, FeatureFlags.VANILLA_FEATURES)
    );
```

1.19.3+ 构造是 `(Factory, FeatureSet)`。Yarn 字段 `FeatureFlags.VANILLA_FEATURES`（官方 Yarn javadoc）。wiki `tutorial:screenhandler` 也可用 `FeatureSet.empty()`。

Yarn 移位是 `quickMove`。客户端只用 `HandledScreens.register`。不要把 26.1.2 Mojmap `MenuType` / `CustomPacketPayload` 抄进本档。
额外数据：`getScreenOpeningData`（1.21.11 loader-api 已核）。

## NamedScreenHandlerFactory（普通打开）

```java
public class MyScreenHandlerFactory implements NamedScreenHandlerFactory {
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

public void openScreen(PlayerEntity player) {
    player.openHandledScreen(new MyScreenHandlerFactory(blockEntity.getInventory()));
}
```

## ExtendedScreenHandlerFactory（额外数据同步）

需要把方块坐标等写到打开包时，用 Fabric `ExtendedScreenHandlerFactory`（本档是 `getScreenOpeningData`，不是编造的 `TypedScreenHandlerFactory`）。

```java
public class MyPosScreenFactory implements ExtendedScreenHandlerFactory<BlockPos> {
    private final BlockPos pos;

    public MyPosScreenFactory(BlockPos pos) {
        this.pos = pos;
    }

    @Override
    public BlockPos getScreenOpeningData(ServerPlayerEntity player) {
        return pos;
    }

    @Override
    public Text getDisplayName() {
        return Text.literal("My Block");
    }

    @Override
    public ScreenHandler createMenu(int syncId, PlayerInventory inv, PlayerEntity player) {
        return new MyScreenHandler(syncId, inv, pos);
    }
}
```

## Fabric Screen API（`fabric-screen-api-v1`）

给**已经打开的原版/其他模组 Screen** 加按钮，用 `ScreenEvents.AFTER_INIT`，不要编造 `SimpleNamedWidget` / `ScreenApi`。
模块已含在 `fabric-api` 中，不要手写过时坐标版本。

```java
ScreenEvents.AFTER_INIT.register((client, screen, scaledWidth, scaledHeight) -> {
    // 仅处理目标 Screen；用 Screens.getButtons(screen) 访问按钮列表
    if (screen instanceof InventoryScreen) {
        // 按需 addDrawableChild / addButton（随 MC 版本）
    }
});
```

## 常见错误

- ❌ 在 `onInitialize()`（主 entrypoint）里注册客户端 Screen — 专用服务端会崩溃，应在 `ClientModInitializer`
- ❌ 在 Screen 类中直接改服务端库存/方块实体 — 应通过 ScreenHandler 的槽位/同步
- ❌ 在 `render()` 里 `new` 按钮或分配大对象 — 控件在 `init()` 创建
- ❌ 忘记给玩家物品栏 `addSlot` — 物品栏不显示（没有 `addPlayerInventory()` 这种原版方法）
- ❌ 在 Screen 中忘记 `super.render(...)` — 背景和子控件不渲染
- ❌ 把 `FeatureFlags.VANILLA`（Yarn `FeatureFlag`）传给 `ScreenHandlerType` — 第二参是 `FeatureSet`，用 `FeatureFlags.VANILLA_FEATURES`（Yarn javadoc 1.19.4–1.21.11）。不要用 Mojmap `VANILLA_SET`。
- ❌ 使用 `TypedScreenHandlerFactory` / `HandlerScreen` / `Menu`（Yarn 容器是 ScreenHandler，不是 Mojmap Menu）

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | ScreenHandler / ContainerType 通过 `Registry.register` 注册 |
| `mc-item` | 物品右键可 `openHandledScreen` / `openContainer` |
| `mc-block` | 方块实体提供 Factory / 打开包数据 |
| `mc-networking` | 槽位不够时再用自定义 Payload 同步进度条等 |
