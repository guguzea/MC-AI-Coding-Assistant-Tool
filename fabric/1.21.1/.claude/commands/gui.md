# GUI / Screen 开发命令

适用版本：Fabric 1.21.1

## 创建基本 Screen

```java
public class MyScreen extends Screen {
    public MyScreen(Text title) {
        super(title);
    }

    @Override
    protected void init() {
        addDrawableChild(ButtonWidget.builder(Text.literal("OK"), btn -> this.close())
            .dimensions(width / 2 - 50, height / 2, 100, 20).build());
    }

    @Override
    public void render(DrawContext matrices, int mouseX, int mouseY, float delta) {
        this.renderBackground(matrices);
        super.render(matrices, mouseX, mouseY, delta);
    }
}
```

## 注册 ScreenHandler

```java
public static final RegistrySupplier<ScreenHandlerType<MyScreenHandler>> MY_SCREEN =
    Registry.register(
        Registries.SCREEN_HANDLER,
        new Identifier(MOD_ID, "my_screen"),
        new ScreenHandlerType<>(MyScreenHandler::new)
    );
```

## 常见问题

### Q: 服务端启动崩溃
A: 检查是否在 ClientModInitializer 而非 onInitialize() 中注册 HandledScreens。

### Q: Screen 不响应点击
A: 检查按钮是否在 addDrawableChild() 中正确添加。

## 相关文件

- rules/10-gui.mdc
- rules/08-client-server.mdc
