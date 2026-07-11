# 注册相关反模式（Fabric 1.14.4）

## 症状

- 游戏启动时报 `NullPointerException` 或 `No such registry`
- 物品/方块在游戏中不存在（显示为缺失模型）
- 物品栏中出现紫色黑色方块
- `Registry.register` 抛出异常

## 根因分析

### 1. 注册在 `onInitialize()` 外执行

**错误代码：**
```java
public class ExampleMod implements ModInitializer {
    // ❌ 类加载时注册，但 onInitialize() 还未执行
    private static final Item MY_ITEM = Registry.register(
        Registry.ITEM,
        new Identifier(MOD_ID, "my_item"),
        new Item(new Item.Settings())
    );

    @Override
    public void onInitialize() {
        // 此时类已加载完毕，注册在类加载时执行
    }
}
```

**正确方案：**
```java
public class ExampleMod implements ModInitializer {
    // ✅ 1.14.4 使用 Registry 字段（而非 Registries 枚举）
    private static final RegistrySupplier<Item> MY_ITEM = Registry.register(
        Registry.ITEM,
        new Identifier(MOD_ID, "my_item"),
        new Item(new Item.Settings())
    );

    @Override
    public void onInitialize() {
        // MY_ITEM 已可用
    }
}
```

> **说明**：Fabric 的 `Registry.register()` 在类加载时（static 初始化块或字段初始化）执行时就已经完成注册，不需要在 `onInitialize()` 中额外调用。但最佳实践是将所有注册集中在一起便于维护。

### 2. BlockItem 与 Block 注册名不一致

**错误代码：**
```java
Registry.register(Registry.BLOCK, new Identifier(MOD_ID, "my_block"), myBlock);
Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_block_item"),  // ❌ 不同名
    new BlockItem(myBlock, new Item.Settings()));
```

**正确方案：**
```java
Registry.register(Registry.BLOCK, new Identifier(MOD_ID, "my_block"), myBlock);
Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_block"),  // ✅ 同名
    new BlockItem(myBlock, new Item.Settings()));
```

### 3. 忘记注册 BlockItem

**错误代码：**
```java
// 注册了方块，但没有物品形态
Registry.register(Registry.BLOCK, new Identifier(MOD_ID, "my_block"), myBlock);
// ❌ 忘记注册 BlockItem
```

**正确方案：**
```java
Registry.register(Registry.BLOCK, new Identifier(MOD_ID, "my_block"), myBlock);
Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_block"),  // ✅ 必需
    new BlockItem(myBlock, new Item.Settings()));
```

### 4. 错误使用 Registry 类型

**错误代码：**
```java
// ❌ 使用了错误的 Registry 类型
Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_block"),
    new BlockItem(myBlock, new Item.Settings()));  // BlockItem 应该是 ITEM
```

### 5. Identifier 命名空间错误

**错误代码：**
```java
// ❌ 直接写完整字符串
new Identifier("examplemod:my_item");  // 这会被当作 namespace = "examplemod:my_item"
// ✅ 正确方式
new Identifier(MOD_ID, "my_item");
```

## 诊断清单

| 检查项 | 方法 |
|--------|------|
| Item 是否注册 | 在游戏中观察物品是否存在 |
| BlockItem 是否同名 | 对比 Block 和 BlockItem 的 Identifier |
| Registry 类型是否正确 | 确认 `Registry.XXX` 正确 |
| Identifier 是否正确 | 确认 namespace 和 id 两部分正确 |
| 加载顺序 | 确认 mod 在依赖的 mod 之后加载 |
