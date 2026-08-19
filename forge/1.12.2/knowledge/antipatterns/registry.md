# 注册相关反模式

## 错误：在静态字段初始化中注册方块/物品

**症状：** `NullPointerException` 或注册的对象在游戏中不存在

```java
// ❌ 错误
public static final Block MY_BLOCK = new Block(Material.ROCK); // 太早
```

**原因：** 静态字段初始化在 RegistryEvent 触发前执行，Registry 系统尚未就绪。

**正确方案：** 使用 `@EventBusSubscriber` + `RegistryEvent.Register<Block>`

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModBlocks {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<Block> event) {
        event.getRegistry().register(
            new Block(Material.ROCK)
                .setRegistryName(MOD_ID, "my_block")
        );
    }
}
```

---

## 错误：忘记 `@EventBusSubscriber` 注解

**症状：** 事件处理器永远不触发

```java
// ❌ 错误
public class ModBlocks {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<Block> event) { ... } // 永远不会调用
}
```

**正确方案：**

```java
@Mod.EventBusSubscriber(modid = MOD_ID)  // ← 必须
public class ModBlocks {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<Block> event) { ... }
}
```

---

## 错误：Registry 名称使用大写或横杠

**症状：** 注册后物品/方块在游戏中不存在

```java
// ❌ 错误
.setRegistryName(MOD_ID, "MyBlock");       // 大写
.setRegistryName(MOD_ID, "my-block");     // 横杠
```

**正确方案：**

```java
// ✅ 全小写、下划线分隔
.setRegistryName(MOD_ID, "my_block");
```

---

## 错误：忘记注册 TileEntity

**症状：** `TileEntity for my_block does not exist` 崩溃

```java
// 方块实现了 createTileEntity() 但忘记注册
```

**正确方案：** 在 `GameRegistry.registerTileEntity` 中注册

```java
GameRegistry.registerTileEntity(MyTileEntity.class, new ResourceLocation(MOD_ID, "my_tile"));
```

---

## 错误：mod ID 与 mcmod.info 不一致

**症状：** mod 在游戏中加载但无法启动

```java
// mcmod.info 中
"modid": "mymod"

// Java 中
public static final String MOD_ID = "mymod123";  // ❌ 不一致
```

**正确方案：** 始终使用相同的 mod ID

```java
public static final String MOD_ID = "mymod";
```
