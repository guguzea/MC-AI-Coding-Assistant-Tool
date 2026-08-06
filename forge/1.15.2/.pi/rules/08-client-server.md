---
description: 08 — 客户端/服务端分离
---

# 08 — 客户端/服务端分离

> 适用版本：Forge 1.15.2

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

IF 代码涉及输入（KeyBinding、MouseListener、KeyboardListener）
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

### Decision: 选择分离模式

```
IF 只需在客户端显示额外信息（如 GUI 覆盖层）
  → 使用 ClientTickEvent / RenderGameOverlayEvent

IF 需要在客户端渲染自定义模型
  → 继承 Render
  → 在 ClientSetup 中注册

IF 需要服务端数据同步到客户端
  → 使用 EntityDataManager（实体数据）
  → 使用 TileEntity.syncable（TileEntity 数据）
  → 使用 SimpleNetworkWrapper（自定义数据）

IF 需要客户端触发服务端逻辑
  → 使用 PlayerInteractEvent（在服务端自然处理）
  → 或使用网络包：客户端 sendToServer() → 服务端处理后可能回复
```

### Decision: 客户端服务端交互方式

```
客户端触发 → 服务端处理：
  PlayerInteractEvent / PlayerInteractEvent.RightClickBlock
  （服务端事件，不需要网络包）

服务端推送 → 客户端更新：
  EntityDataManager（实体属性）
  TileEntity.syncable()（TileEntity 数据）
  SimpleNetworkWrapper 消息（自定义数据）

客户端查询 → 服务端响应：
  SimpleNetworkWrapper（Request-Reply 模式）
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
    }
}
```

## 示例：KeyBinding 处理

```java
// client/input/ModKeyBindings.java
public class ModKeyBindings {
    // KeyMapping 定义
    public static KeyBinding TEST_KEY = new KeyBinding(
        "key.examplemod.test",
        KeyConflictContext.IN_GAME,
        InputMappings.Type.KEYSYM,
        Keyboard.KEY_G,
        "key.categories.examplemod"
    );

    @Mod.EventBusSubscriber(modid = ExampleMod.MOD_ID, bus = Bus.MOD, value = Dist.CLIENT)
    public static class ClientEvents {
        @SubscribeEvent
        public static void onKeyInput(KeyInputEvent event) {
            // 检测按键按下
        }
    }
}
```

## 示例：服务端数据同步（EntityData）

```java
// entities/MyEntity.java（服务端设置，客户端自动同步）
public class MyEntity extends LivingEntity {
    private static final DataManager.Entry<Integer> DATA_CUSTOM =
        new DataManager.Entry<>(new DataSerializers.VARINT);

    @Override
    protected void registerData() {
        super.registerData();
        this.dataManager.register(DATA_CUSTOM, 0);
    }

    public void setCustomValue(int value) {
        // 服务端设置
        this.dataManager.set(DATA_CUSTOM, value);
    }

    public int getCustomValue() {
        // 两端都可以读取
        return this.dataManager.get(DATA_CUSTOM);
    }
}
```

## 示例：TileEntity 数据同步

```java
// tiles/MyTileEntity.java
public class MyTileEntity extends TileEntity {
    private int syncData = 0;

    public MyTileEntity() {
        super(ModTileEntities.MY_TILE_ENTITY.get());
    }

    @Override
    public void read(NBTTagCompound nbt) {
        super.read(nbt);
        this.syncData = nbt.getInt("syncData");
    }

    @Override
    public NBTTagCompound write(NBTTagCompound nbt) {
        super.write(nbt);
        nbt.putInt("syncData", this.syncData);
        return nbt;
    }

    @Override
    public NBTTagCompound getUpdatePacket() {
        NBTTagCompound nbt = new NBTTagCompound();
        write(nbt);
        return nbt;
    }

    @Override
    public void onDataPacket(NetworkManager net, SPacketUpdateTileEntity pkt) {
        read(pkt.getNbtCompound());
    }

    // 在服务端逻辑中修改数据后，同步到客户端
    public void modifyData(int newValue) {
        this.syncData = newValue;
        this.markDirty();
        this.world.notifyBlockUpdate(pos, getBlockState(), getBlockState(), 3);
    }
}
```

> 注意：
> - `markDirty()` 标记数据已修改
> - `world.notifyBlockUpdate()` 将更新通知发送给客户端
> - `getUpdatePacket()` 返回同步数据
> - `onDataPacket()` 处理接收到的数据

## 示例：运行时物理端检测

```java
import net.minecraftforge.fml.util.thread.SidedThreadGroups;

// 在代码中判断物理端
if (LogicalSide.CLIENT.equals(ctx.get().getDirection().getReceptionSide())) {
    // 客户端收到消息
} else {
    // 服务端收到消息
}

// 或者
if (DistExecutor.unsafeCallWhenOn(Dist.CLIENT, () -> this::clientOnlyMethod) != null) {
    // ...
}
```

> 注意：`DistExecutor.unsafeRunForDist` 和类似方法用于在不同物理端运行不同代码。但**强烈建议**避免使用这些方法——更好的设计是让每端的代码完全分离，不在同一条执行路径上混合。
