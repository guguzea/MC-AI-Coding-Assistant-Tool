# 注册相关反模式

## ❌ 使用 `new` 构造函数直接注册方块/物品

```java
// 错误
public static final Block MY_BLOCK = new Block(...);  // ❌ 不会被注册到游戏
```

**错误症状**：方块在世界中显示为缺失方块（紫色黑色格子）

**正确方案**：通过 `RegistryEvent.Register<Block>` 注册并调用 `setRegistryName`

```java
public static final Block MY_BLOCK = new Block(...);

@SubscribeEvent
public void onBlocksRegistry(RegistryEvent.Register<Block> event) {
    event.getRegistry().register(
        MY_BLOCK.setRegistryName(new ResourceLocation(MOD_ID, "my_block"))
    );
}
```

---

## ❌ 不调用 `setRegistryName`

```java
// 错误
event.getRegistry().register(new Block(...)); // ❌ 没有注册名，无法引用
```

**错误症状**：无法在其他地方引用注册的内容

**正确方案**：始终调用 `setRegistryName`

---

## ❌ mod ID 不一致

```java
// mods.toml 中
modId = "examplemod"

// 代码中
private static final String MOD_ID = "ExampleMod"; // ❌ 大写，与 mods.toml 不一致
```

**错误症状**：`RuntimeException: Unable to load a minecraft component`

**正确方案**：确保所有地方使用完全相同的 mod ID（全小写）

```java
private static final String MOD_ID = "examplemod";
```
