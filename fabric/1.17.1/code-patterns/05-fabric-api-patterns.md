# Fabric API 模块模式（Fabric 1.17.1）

> Fabric 独有：Fabric API 提供多个模块化 API，版本 0.31.x。

## ⚠️ 1.17.x 关键差异

- **Fabric API maven 是 `net.fabricmc.fabric-api`**（不是 `net.fabric.sdk`）
- **Fabric API 版本是 `0.31.x`**（如 `0.46.1+1.17`）

## 模式 1：命令注册（fabric-command-api-v1）

```yaml
模式: Command Registration
平台: Fabric
分类: fabric-api
依赖: [fabric-command-api-v1]
扩展点: [CommandRegistrationCallback]
---
public class MyCommands {
    public static void register() {
        CommandRegistrationCallback.EVENT.register((dispatcher, dedicated) -> {
            dispatcher.register(
                LiteralArgumentBuilder.literal("mycommand")
                    .executes(context -> {
                        ServerPlayerEntity player = context.getSource().getPlayer();
                        if (player != null) {
                            player.sendMessage(new LiteralText("Hello from Fabric!"), false);
                        }
                        return 1;
                    })
            );
        });
    }
}

// 在 onInitialize() 中调用
@Override
public void onInitialize() {
    MyCommands.register();
}
```

## 模式 2：快捷键（fabric-keybindings-api-v1）

```yaml
模式: Key Binding
平台: Fabric
分类: fabric-api
依赖: [fabric-keybindings-api-v1]
扩展点: [ClientModInitializer]
---
public class MyKeyBindings {
    public static final KeyBinding MY_KEY = new KeyBinding(
        "key.examplemod.my_key",
        InputUtil.Type.KEYSYM,
        GLFW.GLFW_KEY_P,
        "category.examplemod"
    );
}

public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        KeyBindingHelper.registerKeyBinding(MyKeyBindings.MY_KEY);

        ClientTickEvents.END_CLIENT_TICK.register(client -> {
            while (MyKeyBindings.MY_KEY.wasPressed()) {
                // 处理快捷键
                client.player.sendMessage(new LiteralText("P pressed!"), false);
            }
        });
    }
}
```

## 模式 3：Screen API（fabric-screen-api-v1）

```yaml
模式: Screen Extension
平台: Fabric 1.17.1
分类: fabric-api
依赖: [fabric-screen-api-v1]
扩展点: [ClientModInitializer]
---
// 使用 fabric-screen-api-v1 的高级 Widget
public class MyAdvancedScreen extends Screen {
    @Override
    protected void init() {
        addDrawableChild(new ButtonWidget(this.width / 2 - 50, this.height / 2 - 20, 100, 20,
            new LiteralText("OK"), btn -> {}));
    }
}
```

## 模式 4：Networking API

```yaml
模式: Networking
平台: Fabric 1.17.1
分类: fabric-api
依赖: [fabric-networking-api-v1]
扩展点: [Networking]
---
// 客户端发送包
var buf = PacketByteBufs.create();
buf.writeBlockPos(blockPos);
buf.writeBoolean(true);
ClientPlayNetworking.send(MY_PACKET_ID, buf);

// 服务端接收
ServerPlayNetworking.registerGlobalReceiver(
    MY_PACKET_ID,
    (server, player, handler, packetByteBuf, responseSender) -> {
        BlockPos pos = packetByteBuf.readBlockPos();
        boolean flag = packetByteBuf.readBoolean();
        server.execute(() -> {
            // 处理包
        });
    }
);
```

## 模式 5：Loot API（fabric-loot-api-v1）

```yaml
模式: Loot Modification
平台: Fabric
分类: fabric-api
依赖: [fabric-loot-api-v1]
扩展点: [LootTableLoadingCallback]
扩展点: [onInitialize]
---
public class MyLootModifiers {
    public static void register() {
        LootTableLoadingCallback.EVENT.register((resourceManager, manager, id, supplier, setter) -> {
            if (id.equals(new Identifier("minecraft", "chests/simple_dungeon"))) {
                supplier.withPool(FabricLootPoolBuilder.builder()
                    .withEntry(ItemEntry.builder(Items.DIAMOND).weight(1).build())
                    .build());
            }
        });
    }
}
```

