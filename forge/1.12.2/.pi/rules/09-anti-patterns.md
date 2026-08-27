---
description: 09 — 反模式库
---

# 09 — 反模式库

> 适用版本：Forge 1.12.2
> 本文件收集 MC Mod 开发中的常见错误模式，每条含错误症状和正确方案。

---

## 注册相关

### ❌ 在静态字段初始化时注册（太早）

```java
// 错误
public class ModBlocks {
    public static Block MY_BLOCK = new Block().setRegistryName(MODID, "my_block"); // ❌ 太早
}
```

**错误症状**：`NullPointerException` 或属性不生效

**正确方案**：使用 `@EventBusSubscriber` + `RegistryEvent.Register<Block>` 事件回调

```java
public class ModBlocks {
    public static Block MY_BLOCK;

    @SubscribeEvent
    public static void registerBlocks(RegistryEvent.Register<Block> event) {
        MY_BLOCK = new Block().setRegistryName(MODID, "my_block");
        event.getRegistry().register(MY_BLOCK);
    }
}
```

---

### ❌ 使用 `new Block()` 直接使用（未注册）

```java
// 错误
public static final Block MY_BLOCK = new Block(...);  // ❌ 不会被注册到游戏
```

**错误症状**：方块在世界中显示为缺失方块（紫色黑色格子）

**正确方案**：通过 `RegistryEvent.Register<Block>` 注册

```java
public static Block MY_BLOCK;

@SubscribeEvent
public static void registerBlocks(RegistryEvent.Register<Block> event) {
    MY_BLOCK = new Block(...).setRegistryName(MODID, "my_block");
    event.getRegistry().register(MY_BLOCK);
}
```

---

### ❌ mod ID 不一致

```java
// mcmod.info 中
"modid": "examplemod"

// 代码中
private static final String MODID = "ExampleMod"; // ❌ 大写，与 mcmod.info 不一致
```

**错误症状**：`RuntimeException: Unable to load a minecraft component`

**正确方案**：确保所有地方使用完全相同的 mod ID（全小写）

```java
private static final String MODID = "examplemod";
```

---

## 方块/BlockContainer 相关

### ❌ 在 `readFromNBT` 中读取世界数据

```java
// 错误
@Override
public void readFromNBT(NBTTagCompound compound) {
    super.readFromNBT(compound);
    World world = this.getWorld(); // ❌ world 可能为 null
    // ...
}
```

**错误症状**：`NullPointerException`，游戏崩溃

**正确方案**：在 `validate()` 或其他方法中处理需要世界数据的逻辑

```java
@Override
public void validate() {
    super.validate();
    if (!this.world.isRemote) {
        // 基于世界的初始化逻辑
    }
}
```

---

### ❌ 忘记注册 TileEntityType

```java
// 错误：方块实现了 IHasModel 但没有注册 TileEntity
public class BlockContainer extends Block implements IHasModel {
    // ...
}
```

**错误症状**：`TileEntity` 不工作，容器无法打开

**正确方案**：`GameRegistry.registerTileEntity`（官方 Registries 页的 RegistryEvent 类型不含 TileEntity；没有 `TileEntityType`）

```java
GameRegistry.registerTileEntity(MyTileEntity.class, new ResourceLocation(MODID, "my_tile"));
```

---

## 网络通信相关

### ❌ 在消息处理器中直接修改世界（未用 addScheduledTask）

```java
// 错误
@SubscribeEvent
public void onMessage(MessageExample message, MessageContext ctx) {
    EntityPlayer player = ctx.getServerHandler().player;
    player.getServerWorld().setBlockState(player.getPosition(), Blocks.DIRT.getDefaultState()); // ❌ 不安全
}
```

**错误症状**：异步修改世界导致数据损坏或崩溃

**正确方案**：

```java
@SubscribeEvent
public void onMessage(MessageExample message, MessageContext ctx) {
    EntityPlayer player = ctx.getServerHandler().player;
    player.getServerWorld().addScheduledTask(() -> {
        player.getServerWorld().setBlockState(player.getPosition(), Blocks.DIRT.getDefaultState());
    });
}
```

---

## 事件相关

### ❌ 在 TickEvent 中执行重操作

```java
// 错误
@SubscribeEvent
public void onServerTick(TickEvent.ServerTickEvent event) {
    if (event.phase == TickEvent.Phase.END) {
        for (Entity entity : world.getLoadedEntityList()) { // ❌ 每 tick 遍历所有实体
            processHeavy(entity);
        }
    }
}
```

**错误症状**：服务端严重卡顿，TPS 下降

**正确方案**：
- 使用计数器分散负载
- 每 N tick 处理一批

```java
private int tickCounter = 0;

@SubscribeEvent
public void onServerTick(TickEvent.ServerTickEvent event) {
    if (event.phase == TickEvent.Phase.END) {
        tickCounter++;
        if (tickCounter % 20 == 0) {  // 每秒处理一次
            scheduleProcessing();
        }
    }
}
```

---

## 生命周期相关

### ❌ 在客户端事件中执行游戏逻辑

```java
// 错误
@SideOnly(Side.CLIENT)
public void init(FMLInitializationEvent event) {
    world.setBlockState(pos, Blocks.DIRT.getDefaultState()); // ❌ 禁止在客户端修改世界数据
}
```

**错误症状**：游戏崩溃或数据不同步

**正确方案**：
- 游戏逻辑使用网络包或服务端事件
- 客户端只做渲染和输入处理

---

### ❌ Capability 未检查 null

```java
// 错误
player.getCapability(MY_CAP).ifPresent(cap -> {
    cap.setData(someData); // 如果 Capability 未附加，可能出问题
});
```

**错误症状**：数据写入后丢失，或逻辑不执行

**正确方案**：

```java
// 正确：主动检查 Capability 是否存在
if (player.hasCapability(MY_CAP)) {
    IMyCapability cap = player.getCapability(MY_CAP);
    cap.setData(someData);
}
```

---

## 资源文件相关

### ❌ 资源路径大小写错误

```json
// 错误：文件名包含大写
"textures/item/MyItem.png"  // ❌ 大写

// 正确：全部小写
"textures/item/my_item.png"
```

**错误症状**：材质不加载，显示紫色黑色格子

---

### ❌ 物品模型 JSON 指向不存在的资源

```json
// 错误
{
  "parent": "examplemod:item/my_item"  // ❌ 文件不存在
}
```

**错误症状**：物品显示为紫色黑色方块

---

## 工具提示

当遇到错误时，按以下顺序排查：

1. `09-anti-patterns.mdc` — 是否是已知错误模式
2. 检查 `mcmod.info` 语法和 mod ID 是否一致
3. 检查资源文件路径是否全小写
4. 检查是否混用了服务端和客户端线程
5. 检查 `addScheduledTask` 是否正确使用
6. 检查 Registry 注册是否通过事件系统
