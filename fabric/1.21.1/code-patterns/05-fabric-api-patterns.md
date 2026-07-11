# Fabric API 代码模式

适用版本：Fabric 1.21.1

## 依赖引入

```groovy
dependencies {
    // 完整 Fabric API
    modImplementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"

    // 选择性引入（推荐）
    modImplementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"
    modImplementation "net.fabricmc.fabric-api:fabric-events-interaction-v0:0.6.1"
    modImplementation "net.fabricmc.fabric-api:fabric-screen-api-v1:9.1.1"
    modImplementation "net.fabricmc.fabric-api:fabric-command-api-v2:3.0.0"
    modImplementation "net.fabricmc.fabric-api:fabric-item-api-v1:9.1.1"
    modImplementation "net.fabricmc.fabric-api:fabric-loot-api-v2:3.0.0"
    modImplementation "net.fabricmc.fabric-api:fabric-datagen-api-v0:4.2.1"
}
```

## ItemEvents

```java
// 物品使用事件
ItemEvents.USE_ITEM_ON_BLOCK.register((player, world, hand, hitResult) -> {
    if (!world.isClient && player.getStackInHand(hand).isOf(Items.DIAMOND)) {
        player.sendMessage(Text.literal("Used diamond!"));
        player.getStackInHand(hand).decrement(1);
        return ActionResult.SUCCESS;
    }
    return ActionResult.PASS;
});

// 物品使用时（右键空白）
ItemEvents.USE_ITEM.register((player, world, hand) -> {
    ItemStack stack = player.getStackInHand(hand);
    if (!world.isClient && stack.isOf(Items.EMERALD)) {
        // 处理
        return ActionResult.SUCCESS;
    }
    return ActionResult.PASS;
});
```

## EntityEvents

```java
// 实体受伤
EntityEvents.ENTITY_HURT.register((entity, source, amount, flag) -> {
    if (entity instanceof PlayerEntity && amount > 5.0f) {
        entity.sendMessage(Text.literal("Ouch! You took " + amount + " damage!"));
    }
    return amount;  // 返回修改后的伤害值
});

// 实体死亡
EntityEvents.ENTITY_DEATH.register((entity, source) -> {
    if (entity.getType() == EntityTypes.ZOMBIE) {
        // 僵尸死亡时掉落
        if (!entity.world.isClient) {
            entity.world.spawnEntity(new ItemEntity(
                entity.world, entity.getX(), entity.getY(), entity.getZ(),
                new ItemStack(Items.DIAMOND)
            ));
        }
    }
});
```

## BlockEvents

```java
// 方块破坏前
BlockEvents.BEFORE_BREAK.register((player, world, pos, state, blockEntity) -> {
    if (state.isOf(Blocks.DIAMOND_ORE)) {
        player.sendMessage(Text.literal("No mining diamonds!"));
        return ActionResult.FAIL;  // 阻止破坏
    }
    return ActionResult.PASS;
});

// 方块放置前
BlockEvents.BEFORE_PLACE.register((world, pos, state, player, hand, itemStack, hitResult) -> {
    if (pos.getY() > world.getHeight()) {
        return ActionResult.FAIL;
    }
    return ActionResult.PASS;
});
```

## PlayerTickEvents

```java
// 玩家每 tick
PlayerTickEvents.END.register(player -> {
    if (!player.world.isClient && player.getBlockPos().getY() > 200) {
        player.sendMessage(Text.literal("You're flying too high!"));
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
        HandledScreens.register(
            MY_SCREEN_HANDLER,
            (containerSyncId, inventory, title) ->
                new ExampleScreen(containerSyncId, inventory, title)
        );
    }
}

// 自定义 Screen
public class ExampleScreen extends HandledScreen<ExampleScreenHandler> {
    public ExampleScreen(int syncId, PlayerInventory inventory, Text title) {
        super(new ExampleScreenHandler(syncId, inventory), inventory, title);
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
    if (source == LootTableSource.MODIFIED && key.equals(LootTables.ENTITY_ZOMBIE)) {
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

```java
// 定义 Payload
public class MyPacket implements CustomPayload {
    public static final Id<MyPacket> ID = new Id<>(new Identifier(MOD_ID, "my_packet"));

    private final int value;

    public MyPacket(int value) {
        this.value = value;
    }

    public MyPacket(FriendlyByteBuf buf) {
        this.value = buf.readInt();
    }

    @Override
    public Id<MyPacket> getId() {
        return ID;
    }

    public void write(FriendlyByteBuf buf) {
        buf.writeInt(this.value);
    }

    public static class Receiver implements ServerReceiver<MyPacket> {
        @Override
        public void receive(MyPacket payload, ServerPlayerEntity player) {
            player.sendMessage(Text.literal("Received: " + payload.value));
        }
    }
}

// 注册
CustomPayloadRegistry.register(MyPacket.Receiver::new, ID);

// 发送（客户端）
ClientPlayNetworking.send(MyPacket.ID, new MyPacket(123));

// 发送（服务端）
ServerPlayNetworking.send(player, MyPacket.ID, new MyPacket(123));
```
