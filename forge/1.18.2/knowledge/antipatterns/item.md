# 物品/工具反模式

## 错误：SwordItem 构造函数参数类型或顺序错误

**症状：** 编译错误，找不到对应构造函数

```java
// ❌ 错误（混淆了 Yarn 和 MCP 层）
// Yarn (Fabric) 用 ToolMaterial，Forge/MCP 用 Tier
new SwordItem(MyTier.COPPER, ToolMaterial, 3, 1.6f, new Item.Properties());

// ❌ 错误（参数类型用 float，Forge 1.18.2 用 int）
new SwordItem(Tier, float attackDamage, float attackSpeed, Properties);
```

**正确（Forge 1.18.2 Parchment）：**

```java
new SwordItem(MyTier.COPPER, 3, 1.6f, new Item.Properties());
```

参数解析（按顺序）：

| # | 参数名 | 类型 | 说明 |
|---|--------|------|------|
| 1 | `tier` | `Tier` | 工具材料枚举（如 `Tiers.COPPER` 或自定义 `MyTier.COPPER`） |
| 2 | `attackDamageModifier` | `int` | 基础攻击加成（内部转为 float） |
| 3 | `attackSpeedModifier` | `float` | 攻击速度修正值 |
| 4 | `properties` | `Item.Properties` | 物品属性配置 |

**关于攻击伤害的计算：**

```
最终攻击伤害 = attackDamageModifier(构造函数参数) + 3.0f（剑类内置固定加成）
```

| 想要的总伤害 | attackDamageModifier 参数值 | 说明 |
|-------------|---------------------------|------|
| 5.0 | 2 | 2 + 3.0 = 5.0 |
| 6.0 | 3 | 3 + 3.0 = 6.0 |
| 7.0 | 4 | 4 + 3.0 = 7.0 |

---

## 错误：Tier 枚举的 getAttackDamageBonus() 返回值含类型加成

**症状：** 剑的实际伤害与预期不符

```java
// ❌ 错误理解
public enum MyTier implements Tier {
    COPPER(3, 1561, 8.0f, 4.0f, 15, ...);
    //                                  ^^^^^ 以为这个是总攻击伤害

// 实际效果：4.0 + 3.0 = 7.0（因为剑有 +3.0f 内置加成）
```

---

## 错误：MobEffects.JUMP_BOOST（Fabric Yarn 名）用于 Forge

**症状：** 编译错误，找不到字段

```java
// ❌ 错误（Fabric/Yarn 名称）
new MobEffectInstance(MobEffects.JUMP_BOOST, 200, 1)

// ✅ 正确（Forge/Mojang 名称）
new MobEffectInstance(MobEffects.JUMP, 200, 1)
```

---

## 错误：创建食物时忘记导入 FoodProperties

**症状：** `FoodProperties` 编译错误

```java
// ❌ 忘记导入
new Item(new Item.Properties().food(new FoodProperties.Builder()...))

// ✅ 导入
import net.minecraft.world.food.FoodProperties;
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

## 1.18.2 CreativeModeTab 引用方式

```java
// ✅ 1.18.2 使用 CreativeModeTab.TAB_XXX
new Item.Properties().tab(CreativeModeTab.TAB_MISC)
```
