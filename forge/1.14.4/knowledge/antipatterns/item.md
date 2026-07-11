# 物品/工具反模式

## 错误：SwordItem 构造函数参数类型或顺序错误

**症状：** 编译错误，找不到对应构造函数

```java
// ❌ 错误
new SwordItem(MyTier.COPPER, 3, 1.6f, new Item.Properties());
```

**正确（来源：Forge 1.14.4 MCP 层）：**

```java
// ✅ 正确：4 参数构造函数
new SwordItem(IItemTier tier, float attackDamageIn, float attackSpeedIn, Item.Properties properties)
```

参数解析（按顺序）：

| # | 参数名 | 类型 | 说明 |
|---|--------|------|------|
| 1 | `tier` | `IItemTier` | 工具材料枚举 |
| 2 | `attackDamageIn` | `float` | 基础攻击伤害加成 |
| 3 | `attackSpeedIn` | `float` | 攻击速度修正值 |
| 4 | `properties` | `Item.Properties` | 物品属性配置 |

---

## 错误：IItemTier 枚举 getAttackDamage() 返回值含类型加成

**症状：** 剑的实际伤害与预期不符

```java
// ❌ 错误理解
public enum MyTier implements IItemTier {
    COPPER(3, 1561, 8.0f, 4.0f, 15, ...);
    //                                  ^^^^^ 以为这个是总攻击伤害
}
```

**正确理解：**

```java
public enum MyTier implements IItemTier {
    COPPER(3, 1561, 8.0f, 2.0f, 15, () -> Ingredient.fromItems(Items.DIAMOND));
    //                                  ^^^^^ 这是额外攻击加成
}
```

**说明：** `IItemTier` 的 `getAttackDamage()` 是**额外加成**，剑的基础伤害由 `SwordItem` 内部处理。

---

## 错误：使用 MobEffects.JUMP_BOOST（Fabric Yarn 名）用于 Forge

**症状：** 编译错误，找不到字段

```java
// ❌ 错误（Fabric/Yarn 名称）
new MobEffectInstance(MobEffects.JUMP_BOOST, 200, 1)

// ✅ 正确（Forge/MCP 名称）
new MobEffectInstance(MobEffects.JUMP, 200, 1)
```

---

## 错误：创建食物时忘记导入 Food

**症状：** `Food` 编译错误

```java
// ❌ 忘记导入
new Item.Properties().food(new Food.Builder()...)

// ✅ 导入
import net.minecraft.item.Food;
```

---

## 错误：工具耐久度未设置导致无法破坏

**症状：** 方块不掉落任何物品，工具不消耗耐久

```java
// ❌ 未设置 harvestLevel + requiresCorrectToolForDrops
Block.Properties.create(Material.ROCK)
// 方块总是掉落（无论工具类型）
```

**正确方案：**

```java
Block.Properties.create(Material.ROCK)
    .hardnessAndResistance(3.0f, 3.0f)
    .harvestLevel(2)  // 需要铁镐
    .harvestTool(ToolType.PICKAXE)  // 需要镐子
```

---

## 错误：ItemBlock 未正确关联方块

**症状：** 物品栏有物品但放置后不是对应方块

```java
// ❌ 方块和 ItemBlock 注册了不同的 registry name
BLOCKS.register("my_block", () -> new Block(...));
ITEMS.register("my_block_item", () -> new BlockItem(MY_BLOCK.get(), ...)); // ❌ 名称不同

// ✅ 相同 registry name 自动关联
BLOCKS.register("my_block", () -> new Block(...));
ITEMS.register("my_block", () -> new BlockItem(MY_BLOCK.get(), ...));
```

---

## 错误：物品不显示在创造模式物品栏

**症状：** 物品无法在创造模式物品栏中找到

**正确方案：** 在 Item.Properties 中设置 group：

```java
new Item.Properties()
    .group(ItemGroup.MISC)  // 指定物品栏分组
    .maxStackSize(64)
```
