# 物品/工具反模式

## 错误：SwordItem 构造函数参数类型或顺序错误

**症状：** 编译错误，找不到对应构造函数

```java
// ❌ 错误（混淆了 Yarn 和 MCP 层）
new SwordItem(MyTier.COPPER, ToolMaterial, 3, 1.6f, new Item.Properties());

// ❌ 错误（参数类型用 float，NeoForge 1.20.4 用 int）
new SwordItem(Tier, float attackDamage, float attackSpeed, Properties);
```

**正确（来源：NeoForge 1.20.4 MCP 层）：**

```java
new SwordItem(MyTier.COPPER, 3, 1.6f, new Item.Properties());
```

参数解析（按顺序）：

| # | 参数名 | 类型 | 说明 |
|---|--------|------|------|
| 1 | `tier` | `Tier` | 工具材料枚举 |
| 2 | `attackDamageModifier` | `int` | 基础攻击加成（内部转为 float） |
| 3 | `attackSpeedModifier` | `float` | 攻击速度修正值 |
| 4 | `properties` | `Item.Properties` | 物品属性配置 |

**攻击伤害计算：**

```
最终攻击伤害 = attackDamageModifier(构造函数参数) + 3.0f（剑类内置固定加成）
```

---

## 错误：Tier 枚举的 getAttackDamageBonus() 返回值含类型加成

**症状：** 剑的实际伤害与预期不符

```java
// ❌ 错误理解
public enum MyTier implements Tier {
    COPPER(3, 1561, 8.0f, 4.0f, 15, ...);
    //                                  ^^^^^ 以为这个是总攻击伤害
```

**正确理解：**
```java
public enum MyTier implements Tier {
    COPPER(3, 1561, 8.0f, 2.0f, 15, ...);
    //                                  ^^^^^ 这是额外攻击加成
// 最终剑伤害 = 2.0 + 3.0 = 5.0
```

---

## 错误：使用 getSlotForHand() 回调 hurtEnemy

**症状：** 编译错误，方法不存在

```java
// ❌ 错误
@Override
public boolean hurtEnemy(ItemStack stack, LivingEntity target, LivingEntity attacker) {
    stack.hurtAndBreak(1, attacker, Entity.getSlotForHand(attacker, InteractionHand.MAIN_HAND));
    return true;
}
```

**正确方案：**
```java
// ✅ 使用 lambda 形式，NeoForge 自动获取正确的槽位
@Override
public boolean hurtEnemy(ItemStack stack, LivingEntity target, LivingEntity attacker) {
    stack.hurtAndBreak(1, attacker, slot -> attacker.getItemBySlot(slot));
    return true;
}
```

---

## 错误：MobEffects.JUMP_BOOST（Fabric Yarn 名）用于 NeoForge

**症状：** 编译错误，找不到字段

```java
// ❌ 错误（Fabric/Yarn 名称）
new MobEffectInstance(MobEffects.JUMP_BOOST, 200, 1)

// ✅ 正确（NeoForge/Mojang 名称）
new MobEffectInstance(MobEffects.JUMP, 200, 1)
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
ITEMS.register("my_block", () -> new BlockItem(EXAMPLE_BLOCK.get(), ...));
```
