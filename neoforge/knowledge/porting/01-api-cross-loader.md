# API 跨加载器兼容性

> 本文档列出常见模组 API 在不同平台之间的差异，帮助你编写可移植的代码。

## Capability 系统

### Forge

CLI 核实范围：`query_loader_api --platform=forge` 在 1.17.1 与 1.20.1 两档都只给
`ICapabilityProvider` 两个成员 —— `getCapability(Capability<T>, Direction)`（抽象）与
`getCapability(Capability<T>)`（default），**没有任何类型参数**。

```java
public interface IMyCapability {
    int getValue();
    void setValue(int value);
}

// 附加到实体
@SubscribeEvent
public static void attachCapability(AttachCapabilitiesEvent<Entity> event) {
    if (event.getObject() instanceof Player player) {
        event.addCapability(
            new ResourceLocation(MOD_ID, "my_capability"),
            // ICapabilityProvider 是非泛型接口，写尖括号编译不过
            new ICapabilityProvider() {
                private final IMyCapability instance = new MyCapabilityImpl();
                private final LazyOptional<IMyCapability> opt = LazyOptional.of(() -> instance);

                @Override
                public <T> LazyOptional<T> getCapability(Capability<T> cap, Direction side) {
                    return cap == MY_CAPABILITY ? opt.cast() : LazyOptional.empty();
                }
            }
        );
    }
}

// 获取 Capability
player.getCapability(MY_CAPABILITY).ifPresent(cap -> {
    cap.setValue(42);
});
```

### NeoForge（20.4 / 1.20.4 起，含 1.21.1 与 26.1）

上面那套「往事件里 `addCapability`」在 NeoForge **不成立**：`query_loader_api --platform=neoforge
--minecraftVersion=1.20.4 / 1.21.1 --className=AttachCapabilitiesEvent` 都是 `found:false`，
而 `ICapabilityProvider` 换成了带两个类型参数的 `T getCapability(O object, C context)`，
注册改走 `RegisterCapabilitiesEvent`。

```java
// 以下两条签名逐字来自
// query_loader_api --platform=neoforge --minecraftVersion=1.21.1 --className=RegisterCapabilitiesEvent
//   void registerEntity(EntityCapability<T,C>, EntityType<E>, ICapabilityProvider<? super E,C,T>)
//   void registerBlockEntity(BlockCapability<T,C>, BlockEntityType<BE>, ICapabilityProvider<? super BE,C,T>)
@SubscribeEvent
public static void registerCaps(RegisterCapabilitiesEvent event) {
    event.registerEntity(MY_DATA_CAP, EntityType.PLAYER, (player, context) -> player.myData);
}
```

读取侧的 `getCapability(...)` 调用形态本档未逐签名核实，写代码前先跑一次
`query_loader_api --platform=neoforge`（`found:false` 时改用 `search_neoforge_docs` 该版页面）。


### Fabric（使用附加组件 API）

```java
// Fabric 没有内置 Capability，但可以用附加组件 API 模拟
@AutoRegister
public class MyAttachmentType implements AttachmentType<MyAttachmentData> {
    // Fabric 1.20.1 使用 EntityAttributeModifierEvent + EntityAttachmentsComponent
}

// 或者使用 Fabric Attachment API（fabric-attachment-api-v1）
```

---

## 注册系统对比

### Forge / NeoForge

```java
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(Registries.BLOCK, MOD_ID);

public static final DeferredRegister<Item> ITEMS =
    DeferredRegister.create(Registries.ITEM, MOD_ID);

public static final DeferredHolder<Block, Block> MY_BLOCK =
    BLOCKS.register("my_block", () -> new Block(...));

public static final DeferredHolder<Item, Item> MY_BLOCK_ITEM =
    ITEMS.register("my_block", () -> new BlockItem(MY_BLOCK.get(), ...));

// 注册
public static void init(IEventBus modEventBus) {
    BLOCKS.register(modEventBus);
    ITEMS.register(modEventBus);
}
```

### Fabric

```java
public static final Item MY_ITEM = Registry.register(
    Registries.ITEM,
    new Identifier(MOD_ID, "my_item"),
    new Item(new Item.Settings().maxDamage(100))
);

public static final Block MY_BLOCK = Registry.register(
    Registries.BLOCK,
    new Identifier(MOD_ID, "my_block"),
    new Block(AbstractBlock.Settings.create().hardness(1.0f))
);

// BlockItem 需要单独注册
Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_block"),
    new BlockItem(MY_BLOCK, new Item.Settings()));
```

---

## 事件系统对比

### Forge / NeoForge

```java
// 订阅事件
NeoForge.EVENT_BUS.register(MyMod.class);

@SubscribeEvent
public static void onLivingDeath(LivingDeathEvent event) { ... }

// 或使用 modEventBus
modEventBus.addListener(MyMod::onRegistry);
```

### Fabric

```java
// 使用 Callback 接口
ServerLifecycleEvents.SERVER_STOPPING.register(server -> { ... });

// 或使用公会 API
ServerTickEvents.END_SERVER_TICK.register(server -> { ... });
```

---

## 网络通信对比

### Forge / NeoForge

Forge 1.17–1.20 仍用 `SimpleChannel`。NeoForge **1.21.1 起不要抄下面这段**（loader-api 未收录 `SimpleChannel`；官方是 Payload）。见 `neoforge/<ver>/.cursor/rules/06-networking.mdc`。

```java
// Forge SimpleChannel（不要当 NeoForge 1.21+ 正文）
SimpleChannel channel = NetworkRegistry.newSimpleChannel(id);
channel.registerMessage(id++, MyMessage.class,
    MyMessage::toBytes, MyMessage::new, (msg, ctx) -> {
        ctx.enqueueWork(() -> { /* 处理 */ });
        ctx.setPacketHandled(true);
    });
channel.sendToServer(new MyMessage(42));
```

### Fabric

```java
// 使用 S2C / C2S Payload
public record MyPayload(int data) implements CustomPayload {
    public static final PacketType<MyPayload> TYPE = new PacketType<>() { ... };

    @Override public Id<? extends CustomPayload> getId() { return TYPE; }
}

// 注册
ServerPlayNetworking.registerGlobalReceiver(MyPayload.TYPE, (payload, context) -> {
    // 处理
});

// 发送
ServerPlayNetworking.send(player, new MyPayload(42));
```

---

## 配方/数据生成对比

### Forge / NeoForge

```java
@SubscribeEvent
public static void gatherData(GatherDataEvent event) {
    event.getGenerator().addProvider(
        event.includeServer(),
        new MyRecipeProvider(event.getGenerator().getPackOutput())
    );
}
```

### Fabric

```java
// Fabric 1.20+ 使用 FabricDataGenerator
private static void onInitializeDataGenerator(FabricDataGenerator generator) {
    FabricDataGenerator.Pack pack = generator.createPack(false);
    pack.addProvider(MyRecipeProvider::new);
}
```

---

## 常用 Fabric API 替代 NeoForge 功能

| NeoForge 功能 | Fabric 替代 |
|---------------|-------------|
| Capability | Entity Attachment API |
| Fluid | FabricFluidAPI |
| Particle | FabricParticlesAPI |
| GUI Screen | ScreenHandler / HandledScreens |
| Villager Trade | VillagerRegistry |
| LootModifier | FabricLootModifiers |
| Culling | FabricCullingAPI |
