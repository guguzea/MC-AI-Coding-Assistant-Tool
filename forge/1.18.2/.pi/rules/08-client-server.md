---
description: 08 — 客户端/服务端分离
---

# 08 — 客户端/服务端分离

> 适用版本：Forge 1.18.2

---

## 约束

### 物理端注解

| 注解 | 含义 | 使用场景 |
|------|------|----------|
| `@OnlyIn(Dist.CLIENT)` | 仅在客户端运行 | 渲染器、粒子、输入处理 |
| `@OnlyIn(Dist.DEDICATED_SERVER)` | 仅在服务端运行 | 服务端逻辑、AI、数据处理 |
| 无注解 | 客户端和服务端都运行 | 通用逻辑 |

### 线程约束

- **服务端线程**：游戏逻辑处理、事件订阅（大多数）
- **客户端线程**：渲染、输入（KeyBinding）、粒子效果
- **禁止**在渲染线程中执行服务端逻辑（如修改世界数据）
- **禁止**在服务端线程中直接调用客户端渲染方法

### 分离架构

```
src/main/java/
├── MyMod.java                    # 两端都加载
├── registry/
│   └── ModBlocks.java           # 两端都加载
├── client/
│   ├── ClientSetup.java          # 仅客户端（@Mod.EventBusSubscriber(bus=MOD, value=Dist.CLIENT)）
│   └── rendering/
│       └── MyBlockRenderer.java # 仅客户端
└── init/
    └── ModEvents.java           # 两端都加载
```

- **禁止**将 `@OnlyIn(Dist.CLIENT)` 的类放在 `client` 包以外
- **禁止**在非 `@OnlyIn(Dist.CLIENT)` 的类中调用任何客户端特有方法

### FMLClientSetupEvent vs FMLCommonSetupEvent

- `FMLCommonSetupEvent`：两端都会收到，用于通用初始化
- `FMLClientSetupEvent`：**仅客户端**收到，用于客户端特有初始化

---

## Decision Flow

### Decision: 代码应该放在哪一端

```
IF 代码涉及渲染（Model、BakedQuad、RenderType）
  → 客户端
  → 放在 client/ 包下
  → 使用 @OnlyIn(Dist.CLIENT)

IF 代码涉及输入（KeyMapping、MouseListener、KeyboardListener）
  → 客户端
  → 放在 client/ 包下
  → 使用 @OnlyIn(Dist.CLIENT)

IF 代码涉及粒子效果
  → 客户端
  → 放在 client/ 包下
  → 使用 @OnlyIn(Dist.CLIENT)

IF 代码涉及 GUI（Screen、Button）
  → 客户端
  → 放在 client/ 包下

IF 代码涉及游戏逻辑（实体行为、方块交互、数据存储）
  → 服务端
  → 使用 @OnlyIn(Dist.DEDICATED_SERVER) 或不标注

IF 代码既涉及渲染又涉及逻辑
  → 分离处理
  → 逻辑在服务端（数据包同步）
  → 渲染在客户端（接收同步数据后渲染）

IF 代码涉及网络消息处理
  → 客户端消息 → 服务端处理
  → 服务端消息 → 客户端处理
  → 消息类两端的代码必须都能运行
```

---

## 示例：客户端初始化

```java
// client/ClientSetup.java
@Mod.EventBusSubscriber(modid = ExampleMod.MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class ClientSetup {

    @SubscribeEvent
    public static void onClientSetup(FMLClientSetupEvent event) {
        // FMLClientSetupEvent 仅用于客户端特有初始化
        // KeyBinding 注册应在 RegisterKeyMappingsEvent 中完成
    }

    @SubscribeEvent
    public static void registerKeyMappings(RegisterKeyMappingsEvent event) {
        event.register(TEST_KEY);  // TEST_KEY 需定义在静态字段中
    }

    @SubscribeEvent
    public static void onRegisterRenderers(EntityRenderersEvent.RegisterRenderers event) {
        // 注册实体渲染器
        event.registerEntityRenderer(ModEntities.MY_ENTITY.get(), MyEntityRenderer::new);
    }
}
```

## 示例：KeyBinding 处理

```java
// client/input/ModKeyBindings.java
// KeyMapping 定义
public static final KeyMapping TEST_KEY = new KeyMapping(
    "key.examplemod.test",
    KeyConflictContext.IN_GAME,
    InputConstants.Type.KEYSYM,
    GLFW.GLFW_KEY_G,
    "key.categories.examplemod"
);

@Mod.EventBusSubscriber(modid = ExampleMod.MOD_ID, bus = Bus.MOD, value = Dist.CLIENT)
public class ModKeyBindings {
    @SubscribeEvent
    public static void register(RegisterKeyMappingsEvent event) {
        event.register(TEST_KEY);
    }

    @SubscribeEvent
    public static void onClientTick(ClientTickEvent event) {
        if (event.getPhase() == TickEvent.Phase.END) {
            while (TEST_KEY.consumeClick()) {
                // 按键按下时的逻辑
            }
        }
    }
}
```

## 示例：服务端数据同步（SynchedEntityData）

```java
// entities/MyEntity.java（服务端设置，客户端自动同步）
public class MyEntity extends LivingEntity {
    private static final EntityDataAccessor<Integer> DATA_CUSTOM =
        SynchedEntityData.defineId(MyEntity.class, EntityDataSerializers.INT);

    @Override
    protected void defineSynchedData() {
        this.entityData.define(DATA_CUSTOM, 0);
    }

    public void setCustomValue(int value) {
        this.entityData.set(DATA_CUSTOM, value);
    }

    public int getCustomValue() {
        return this.entityData.get(DATA_CUSTOM);
    }
}
```

## 示例：BlockEntity 数据同步

```java
// entities/MyBlockEntity.java
public class MyBlockEntity extends BlockEntity {
    private int syncData = 0;

    public MyBlockEntity(BlockPos pos, BlockState state) {
        super(ModBlockEntities.MY_BLOCK_ENTITY.get(), pos, state);
    }

    @Override
    public void load(CompoundTag nbt) {
        super.load(nbt);
        this.syncData = nbt.getInt("syncData");
    }

    @Override
    protected void saveAdditional(CompoundTag nbt) {
        super.saveAdditional(nbt);
        nbt.putInt("syncData", this.syncData);
    }

    @Override
    public CompoundTag getUpdateTag() {
        CompoundTag nbt = super.getUpdateTag();
        nbt.putInt("syncData", this.syncData);
        return nbt;
    }

    @Override
    public void handleUpdateTag(CompoundTag nbt) {
        super.handleUpdateTag(nbt);
        this.syncData = nbt.getInt("syncData");
    }

    public void modifyData(int newValue, Level level, BlockPos pos) {
        this.syncData = newValue;
        this.setChanged();
        level.sendBlockUpdated(pos, this.getBlockState(), this.getBlockState(), Block.UPDATE_ALL);
    }
}
```
