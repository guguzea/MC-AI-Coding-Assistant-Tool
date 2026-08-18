# Fabric API 代码模式

适用版本：Fabric 1.21.1

## 依赖引入

```groovy
dependencies {
    // 完整 Fabric API
    modImplementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"

    // 完整 fabric-api 已含下列模块，不要手写过时独立版本号
    // fabric-events-interaction-v0 / fabric-screen-api-v1 / fabric-command-api-v2
    // fabric-item-api-v1 / fabric-loot-api-v3 / fabric-datagen-api-v1
}
```

## 交互事件（Fabric API `fabric-events-interaction-v0`）

不要编造 `ItemEvents` / `BlockEvents` / `EntityEvents` / `PlayerTickEvents`。

```java
import net.fabricmc.fabric.api.event.player.UseItemCallback;
import net.fabricmc.fabric.api.event.player.UseBlockCallback;
import net.fabricmc.fabric.api.event.player.PlayerBlockBreakEvents;
import net.fabricmc.fabric.api.entity.event.v1.ServerLivingEntityEvents;
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents;
import net.minecraft.util.ActionResult;
import net.minecraft.util.TypedActionResult;

UseItemCallback.EVENT.register((player, world, hand) -> {
    return TypedActionResult.pass(player.getStackInHand(hand));
});

UseBlockCallback.EVENT.register((player, world, hand, hitResult) -> {
    return ActionResult.PASS;
});

PlayerBlockBreakEvents.BEFORE.register((world, player, pos, state, blockEntity) -> {
    return true; // false 则取消破坏
});

ServerLivingEntityEvents.AFTER_DEATH.register((entity, damageSource) -> {
    // 服务端，实体已死亡
});

ServerTickEvents.END_SERVER_TICK.register(server -> {
    for (var player : server.getPlayerManager().getPlayerList()) {
        // 每 tick 玩家逻辑
    }
});
```

## ServerLifecycleEvents

```java
// 服务端启动
ServerLifecycleEvents.SERVER_STARTED.register(server -> {
    LOGGER.info("Server started: " + server.getName());
});

// 服务端停止中
ServerLifecycleEvents.SERVER_STOPPING.register(server -> {
    LOGGER.info("Server stopping...");
});

// 服务端已停止
ServerLifecycleEvents.SERVER_STOPPED.register(server -> {
    LOGGER.info("Server stopped");
});
```

## Command API

```java
// 注册命令
ClientCommandRegistrationCallback.EVENT.register((dispatcher, registryAccess) -> {
    dispatcher.register(ClientCommandManager.literal("example")
        .then(ClientCommandManager.argument("message", StringArgumentType.string())
            .executes(context -> {
                String message = StringArgumentType.getString(context, "message");
                context.getSource().getPlayer().sendMessage(Text.literal(message));
                return 1;
            })
        )
    );
});
```

## Screen API

```java
// 注册 Screen
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        HandledScreens.register(MY_SCREEN_HANDLER, ExampleScreen::new);
    }
}

// 自定义 Screen
public class ExampleScreen extends HandledScreen<ExampleScreenHandler> {
    public ExampleScreen(ExampleScreenHandler handler, PlayerInventory inventory, Text title) {
        super(handler, inventory, title);
    }

    @Override
    protected void init() {
        super.init();
        // 初始化
    }

    @Override
    public void render(DrawContext context, int mouseX, int mouseY, float delta) {
        super.render(context, mouseX, mouseY, delta);
        // 渲染
    }
}
```

## Loot API

```java
// 修改掉落表
LootTableEvents.MODIFY.register((key, tableBuilder, source, registries) -> {
    // 1.21.x 是 loot.v3：参数为 RegistryKey + builder + source + registries
    if (key.getValue().equals(Identifier.of("minecraft", "entities/zombie"))) {
        tableBuilder.pool(builder -> builder
            .with(ItemEntry.builder(Items.DIAMOND)
                .weight(1)
                .quality(0)
            )
        );
    }
});
```

## Networking (1.21.x)

Yarn 1.21.x 用 `CustomPayload` + `PayloadTypeRegistry.playC2S()` / `playS2C()`。不要 `CustomPayloadRegistry`、`ServerReceiver`、`PayloadTypeRegistry.s2c()`。

```java
import net.minecraft.network.RegistryByteBuf;
import net.minecraft.network.codec.PacketCodec;
import net.minecraft.network.codec.PacketCodecs;
import net.minecraft.network.packet.CustomPayload;
import net.minecraft.util.Identifier;
import net.fabricmc.fabric.api.networking.v1.PayloadTypeRegistry;
import net.fabricmc.fabric.api.networking.v1.ServerPlayNetworking;
import net.fabricmc.fabric.api.networking.v1.ClientPlayNetworking;

public record MyPayload(int data) implements CustomPayload {
    public static final CustomPayload.Id<MyPayload> ID =
        new CustomPayload.Id<>(Identifier.of(MOD_ID, "my_packet"));
    public static final PacketCodec<RegistryByteBuf, MyPayload> CODEC =
        PacketCodec.tuple(PacketCodecs.VAR_INT, MyPayload::data, MyPayload::new);

    @Override
    public Id<? extends CustomPayload> getId() {
        return ID;
    }
}

PayloadTypeRegistry.playC2S().register(MyPayload.ID, MyPayload.CODEC);
PayloadTypeRegistry.playS2C().register(MyPayload.ID, MyPayload.CODEC);

ServerPlayNetworking.registerGlobalReceiver(MyPayload.ID, (payload, context) -> {
    int value = payload.data();
});
ClientPlayNetworking.registerGlobalReceiver(MyPayload.ID, (payload, context) -> {
    int value = payload.data();
});

ServerPlayNetworking.send(player, new MyPayload(123));
ClientPlayNetworking.send(new MyPayload(123));
```
