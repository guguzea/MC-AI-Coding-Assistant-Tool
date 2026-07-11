# Fabric API 模块模式（Fabric 1.17.1）

> Fabric 独有：Fabric API 提供多个模块化 API，版本 0.31.x。

## ⚠️ 1.17.x 关键差异

- **Fabric API maven 是 `net.fabricmc.fabric-api`**（不是 `net.fabric.sdk`）
- **Fabric API 版本是 `0.31.x`**（如 `0.31.1+build.1`）

## 模式 1：命令注册（fabric-command-api-v2）

```yaml
模式: Command Registration
平台: Fabric 1.17.1
分类: fabric-api
依赖: [fabric-command-api-v2]
扩展点: [CommandRegistrationCallback]
---
public class MyCommands {
    public static void register() {
        CommandRegistrationCallback.EVENT.register((dispatcher, dedicated) -> {
            dispatcher.register(
                LiteralArgumentBuilder.literal("mycommand")
                    .executes(context -> {
                        PlayerEntity player = context.getPlayer();
                        player.sendMessage(new LiteralText("Hello from Fabric!"), false);
                        return 1;
                    })
            );
        });
    }
}

@Override
public void onInitialize() {
    MyCommands.register();
}
```

## 模式 2：快捷键（fabric-keybindings-api-v1）

```yaml
模式: Key Binding
平台: Fabric 1.17.1
分类: fabric-api
依赖: [fabric-keybindings-api-v1]
扩展点: [ClientModInitializer]
---
public class MyKeyBindings {
    public static final KeyBinding MY_KEY = new KeyBinding(
        "key.examplemod.my_key",
        InputUtil.Type.KEYSYM,
        InputUtil.fromCode(80),  // P 键
        "category.examplemod"
    );
}

public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        KeyBindingHelper.registerKeyBinding(MyKeyBindings.MY_KEY);

        ClientTickEvents.END_CLIENT_TICK.register(client -> {
            while (MyKeyBindings.MY_KEY.wasPressed()) {
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
    private final List<Selectable> selectables = new ArrayList<>();

    @Override
    protected void init() {
        addSelectableChild(new SimpleNamedWidget(
            new LiteralText("Title"),
            width / 2 - 50, height / 2 - 50, 100, 20,
            new LiteralText("My Screen"), textRenderer
        ));
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
ClientSidePacketRegistry.INSTANCE.sendToServer(
    MY_PACKET_ID,
    buf -> PacketByteBufs.create().writeBlockPos(blockPos).writeBoolean(true)
);

// 服务端接收
ServerSidePacketRegistry.INSTANCE.register(
    MY_PACKET_ID,
    (packetContext, packetByteBuf) -> {
        BlockPos pos = packetByteBuf.readBlockPos();
        boolean flag = packetByteBuf.readBoolean();
        packetContext.getTaskQueue().execute(() -> {
            // 处理包
        });
    }
);
```

## 模式 5：Loot API（fabric-loot-api-v2）

```yaml
模式: Loot Modification
平台: Fabric 1.17.1
分类: fabric-api
依赖: [fabric-loot-api-v2]
扩展点: [LootTableEvents]
---
LootTableEvents.MODIFY.register((resourceManager, lootManager, id, tableBuilder, source) -> {
    if (id.equals(LootTableIds.CHESTS_SIMPLE_DUNGEON)) {
        tableBuilder.pool(
            LootPool.builder()
                .rolls(ConstantRange.create(1))
                .bonusRolls(UniformRange.create(0, 1))
                .entry(ItemEntry.builder(Items.DIAMOND).weight(1).build())
                .condition(SurvivesExplosionCondition.builder())
                .build()
        );
    }
});
```
