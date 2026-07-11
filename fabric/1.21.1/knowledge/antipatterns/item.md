# 物品相关反模式

## ❌ 创建物品后不注册

**症状**：物品在游戏中不显示

**原因**：`new Item()` 后没有调用 `Registry.register()`

```java
// ❌ 错误
private static final Item MY_ITEM = new Item(new Item.Settings());

// ✅ 正确
private static final RegistrySupplier<Item> MY_ITEM =
    Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_item"),
        new Item(new Item.Settings()));
```

## ❌ BlockItem 与 Block 使用不同的注册名

**症状**：物品形态缺失，显示为紫色黑色方块

**原因**：BlockItem 的 registry name 与 Block 不一致

```java
// ❌ 错误
Registry.register(Registries.BLOCK, new Identifier(MOD_ID, "my_block"), myBlock);
Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_block_item"),  // 不同名！
    new BlockItem(myBlock, new Item.Settings()));

// ✅ 正确
Registry.register(Registries.BLOCK, new Identifier(MOD_ID, "my_block"), myBlock);
Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_block"),  // 同名！
    new BlockItem(myBlock, new Item.Settings()));
```

## ❌ 忘记设置耐久消耗

**症状**：工具/物品从不消耗耐久

**原因**：`Item.Settings` 没有配置 `maxDamage`，或者 `postHit()` 等方法没有调用 `damage()`

```java
// ✅ 正确：设置最大耐久
new Item(new Item.Settings().maxDamage(100))

// ✅ 正确：在事件中消耗耐久
@Override
public boolean postHit(ItemStack stack, LivingEntity target, LivingEntity attacker) {
    stack.damage(1, attacker, (entity) -> {
        entity.sendToolBreakStatus(attacker.getActiveHand());
    });
    return true;
}
```

## ❌ 食物未设置 hunger

**症状**：食物可食用但消耗速度不对，或根本不消耗

**原因**：`FoodComponent.Builder` 中忘记调用 `.hunger()`

```java
// ❌ 错误
new Item(new Item.Settings().food(
    new FoodComponent.Builder()
        .saturationModifier(1.0f)  // 忘记 hunger()
        .build()
))

// ✅ 正确
new Item(new Item.Settings().food(
    new FoodComponent.Builder()
        .hunger(4)  // 饱食度恢复量
        .saturationModifier(1.2f)  // 饱和度
        .build()
))
```

## ❌ mod ID 使用横杠

**症状**：资源定位符解析失败

**原因**：mod ID 中使用了 `-` 字符

```java
// ❌ 错误
new Identifier("my-mod", "my_item")  // mod ID 不能有横杠

// ✅ 正确
new Identifier("mymod", "my_item")  // 使用下划线或直接拼接
```

## ❌ 注册名使用大写或横杠

**症状**：物品模型不加载

**原因**：registry name 必须是全小写，不能有横杠

```java
// ❌ 错误
new Identifier(MOD_ID, "My_Item")     // 大写
new Identifier(MOD_ID, "my-item")     // 横杠

// ✅ 正确
new Identifier(MOD_ID, "my_item")     // 全小写，下划线分隔
```
