# Fabric API 模块模式（Fabric 1.20.1）

> Fabric 独有：Fabric API 提供 20+ 模块化 API。

## 模式 1：命令注册（fabric-command-api-v2）

```yaml
模式: Command Registration
平台: Fabric
分类: fabric-api
依赖: [fabric-command-api-v2]
扩展点: [CommandRegistrationCallback]
---
public class MyCommands {
    public static void register() {
        CommandRegistrationCallback.EVENT.register((dispatcher, registryAccess, environment) -> {
            dispatcher.register(
                LiteralArgumentBuilder.literal("mycommand")
                    .executes(context -> {
                        PlayerEntity player = context.getPlayer();
                        player.sendMessage(Text.literal("Hello from Fabric!"));
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
依赖: [fabric-keybindings-api-v0]
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
                // 处理快捷键
                client.player.sendMessage(Text.literal("P pressed!"));
            }
        });
    }
}
```

## 模式 3：Screen API（fabric-screen-api-v1）

```yaml
模式: Screen Extension
平台: Fabric
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
            Text.literal("Title"),
            width / 2 - 50, height / 2 - 50, 100, 20,
            Text.literal("My Screen"), textRenderer
        ));
    }
}
```

## 模式 4：Registry Sync（fabric-registry-sync-v0）

```yaml
模式: Registry Sync
平台: Fabric
分类: fabric-api
依赖: [fabric-registry-sync-v0]
扩展点: [onInitialize]
---
// 注册自定义 Registry
@Override
public void onInitialize() {
    // 注册自定义 Registry 类型
    Registry.register(
        Registries.CUSTOM_REGISTRY,
        new Identifier(MOD_ID, "my_registry"),
        MyRegistryKey
    );
}
```

## 模式 5：Loot API（fabric-loot-api-v2）

```yaml
模式: Loot Modification
平台: Fabric
分类: fabric-api
依赖: [fabric-loot-api-v2]
扩展点: [LootTableEvents]
扩展点: [onInitialize]
---
public class MyLootModifiers {
    public static void register() {
        LootTableEvents.MODIFY.register((key, tableBuilder, source, registries) -> {
            if (key.equals(LootTableIds.CHESTS_SIMPLE_DUNGEON)) {
                tableBuilder.pool(
                    LootPool.builder()
                        .rolls(ConstantLootNumberProvider.create(1))
                        .bonusRolls(0, 0)
                        .entry(
                            ItemEntry.builder(Items.DIAMOND)
                                .weight(1)
                                .build()
                        )
                        .build()
                );
            }
        });
    }
}
```

## 模式 6：Networking API（fabric-networking-api-v1）

```yaml
模式: Advanced Networking
平台: Fabric
分类: fabric-api
依赖: [fabric-networking-api-v1]
扩展点: [Networking]
---
public class MyNetworkingV2 {
    public static final Identifier MY_PACKET = new Identifier(MOD_ID, "my_packet");

    public static void init() {
        // 注册网络接收器
    }
}
```
