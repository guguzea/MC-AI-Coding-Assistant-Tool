---
name: mc-gui
description: Fabric GUI/Screen 开发。Screen、HandledScreens、ScreenHandler。触发词：GUI、Screen、HandledScreens、ScreenHandler
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
---

# GUI 开发（Fabric 1.21.11）

## 快速开始

```java
// 服务端：ScreenHandler
public class MyScreenHandler extends ScreenHandler {
    public MyScreenHandler(int syncId, PlayerInventory playerInventory) {
        super(ModScreenHandlers.MY_SCREEN, syncId);
        // ...
    }
}

// 注册 ScreenHandler
private static final ScreenHandlerType<MyScreenHandler> MY_SCREEN =
    Registry.register(
        Registries.SCREEN_HANDLER,
        Identifier.of(MOD_ID, "my_screen"),
        new ScreenHandlerType<>(MyScreenHandler::new, FeatureFlags.VANILLA_FEATURES)
    );

// 客户端：Screen
public class MyScreen extends Screen {
    public MyScreen(Text title) {
        super(title);
    }

    @Override
    protected void init() {
        addDrawableChild(ButtonWidget.builder(Text.literal("OK"),
            btn -> this.close()).dimensions(width/2-50, height/2, 100, 20).build());
    }
}

// 客户端：注册 Screen
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        HandledScreens.register(MY_SCREEN, MyScreen::new);
    }
}
```

## Decision: 选择 GUI 类型

```
IF 简单界面（按钮、文本）
  → Screen + TextFieldWidget

IF 容器型界面（箱子）
  → ScreenHandler + HandledScreens

IF 需要服务端数据同步
  → NamedScreenHandlerFactory
```

## 常见错误

- ❌在 `onInitialize()` 中注册 `HandledScreens` — 服务端崩溃
- ❌在 Screen 中直接修改服务端数据 — 通过 ScreenHandler 同步
- ❌忘记 `super.render()` — 背景和子元素不渲染

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | ScreenHandler 通过 Registry.register() 注册 |
| `mc-block` | 方块实体提供 ScreenHandler |
| `mc-networking` | 网络包用于打开/关闭 GUI |
