---
name: mc-gui
description: Fabric 1.14.4 GUI。Container、ContainerType、ScreenProviderRegistry。触发词：GUI、Container、Screen、ScreenProviderRegistry
platform: fabric
version: "1.14.4"
dependencies: []
mappings: yarn
---

# GUI 开发（Fabric 1.14.4）

1.14.x Yarn 服务端菜单是 `Container` / `ContainerType` / `Registry.CONTAINER`。
客户端用 `ScreenProviderRegistry`，打开用 `ContainerProviderRegistry`。
不要抄 1.16+ 的 `ScreenHandler` / `HandledScreens` / `NamedScreenHandlerFactory` / `ButtonWidget.builder` / `Text.literal`。
不要写 `net.fabric.sdk`。

Yarn 已核：`Container(ContainerType, int)`、`Screen(Text)`、`ButtonWidget(..., String, PressAction)`、`transferSlot`。

## 快速开始

```java
public class MyContainer extends Container {
    public MyContainer(int syncId, PlayerInventory playerInventory) {
        super(MY_SCREEN, syncId);
        // addSlot(...)：方块槽 + 玩家物品栏
    }

    @Override
    public boolean canUse(PlayerEntity player) {
        return true;
    }

    @Override
    public ItemStack transferSlot(PlayerEntity player, int invSlot) {
        return ItemStack.EMPTY;
    }
}

public static final Identifier MY_SCREEN_ID = new Identifier(MOD_ID, "my_screen");

public static final ContainerType<MyContainer> MY_SCREEN = Registry.register(
    Registry.CONTAINER,
    MY_SCREEN_ID,
    new ContainerType<>(MyContainer::new)
);
```

客户端注册与按钮：

```java
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        ScreenProviderRegistry.INSTANCE.registerFactory(
            MY_SCREEN_ID,
            (ContainerScreenFactory<MyContainer>) container ->
                new MyScreen(new TranslatableText("gui.examplemod.my_screen"))
        );
    }
}

public class MyScreen extends Screen {
    public MyScreen(Text title) {
        super(title);
    }

    @Override
    protected void init() {
        addButton(new ButtonWidget(width / 2 - 50, height / 2, 100, 20,
            "OK", btn -> this.minecraft.openScreen(null)));
    }
}
```

服务端打开（同一 Identifier；工厂签名已核 loader-api）：

```java
ContainerProviderRegistry.INSTANCE.registerFactory(
    MY_SCREEN_ID,
    (syncId, identifier, player, buf) -> new MyContainer(syncId, player.inventory));

ContainerProviderRegistry.INSTANCE.openContainer(
    MY_SCREEN_ID, (ServerPlayerEntity) player, buf -> {});
```

## Decision: 选择 GUI 类型

```
IF 简单界面（按钮、文本）
  → Screen + TextFieldWidget + addButton(ButtonWidget 构造函数)

IF 容器型界面（箱子、机器）
  → Container + ScreenProviderRegistry + ContainerProviderRegistry

IF 需要同步额外数据
  → openContainer 的 PacketByteBuf writer（不要编造 TypedScreenHandlerFactory）
```

## 常见错误

- ❌ 在 `onInitialize()` 里注册客户端 Screen — 专用服务端崩溃，应在 `ClientModInitializer`
- ❌ 在 Screen 里直接改服务端库存 — 通过 Container 槽位同步
- ❌ 忘记 `super.render()` — 背景和子控件不渲染
- ❌ 用 `HandledScreens` / `ScreenHandler` / `Text.literal` / `ButtonWidget.builder` — 都不是本档 API
- ❌ `MatrixStack` 版 `render` — 1.14.4 的 `render` 没有 MatrixStack 参数
- ❌ `super()` / `super(null, syncId)` — Yarn 是 `Container(ContainerType, int)`
- ❌ 抄 wiki 现页 `quickMove` — 本档 Yarn 名是 `transferSlot`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | `ContainerType` 用 `Registry.register(Registry.CONTAINER, ...)` |
| `mc-block` | 方块实体里调用 `ContainerProviderRegistry.openContainer` |
| `mc-networking` | 槽位不够时再发自定义包 |
