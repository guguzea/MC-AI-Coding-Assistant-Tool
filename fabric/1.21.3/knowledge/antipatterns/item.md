# 物品相关反模式（Fabric 1.21.3）

## 症状

- 物品无法堆叠
- 食物不消耗
- 工具不耐久
- 物品显示为缺失模型

## 根因分析

### 1. 忘记设置耐久上限

**错误代码：**
```java
// ❌ 没调 maxDamage：本档 Yarn Item.Settings 默认 maxDamage=0（不可损坏），不是 Integer.MAX_VALUE
private static final Item MY_TOOL = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "my_tool"),
    new Item(new Item.Settings())
);
```

**正确方案：**
```java
private static final Item MY_TOOL = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "my_tool"),
    new Item(new Item.Settings().maxDamage(100))  // ✅ 设置耐久
);
```

### 2. FoodComponent 忘记饥饿值

**错误代码：**
```java
new Item(new Item.Settings().food(
    new FoodComponent.Builder()
        .saturationModifier(1.0f)  // ❌ 忘记 .nutrition()
        .build())
);
```

**正确方案：**
```java
new Item(new Item.Settings().food(
    new FoodComponent.Builder()
        .nutrition(4)  // ✅ 必须设置
        .saturationModifier(1.0f)
        .build())
);
```

本档 `FoodComponent.Builder` 的具名方法是 `nutrition(int)`（**不叫** `hunger`），四个具名方法只有 `nutrition` / `saturationModifier` / `alwaysEdible` / `build`；口径同 `03-item.mdc`「食物」一节。

### 3. 工具没有实现 damage 逻辑

**错误代码：**
```java
public class MyTool extends Item {
    @Override
    public boolean postHit(ItemStack stack, LivingEntity target, LivingEntity attacker) {
        return true;  // ❌ 没有消耗耐久
    }
}
```

**正确方案：**
```java
public class MyTool extends Item {
    @Override
    public boolean postHit(ItemStack stack, LivingEntity target, LivingEntity attacker) {
        if (attacker instanceof PlayerEntity player) {
            stack.damage(1, player);  // ✅ 消耗耐久（本档 (int, PlayerEntity) 重载 = method_61653）
        }
        return true;
    }
}
```

本档 `ItemStack.damage` **没有** 1.18 那个 `(int, LivingEntity, Consumer)` 三参 lambda 重载，`sendToolBreakStatus` 在 Yarn 1.21.3 映射里也不存在；带槽位的 `(int, LivingEntity, EquipmentSlot)` 需要 `EquipmentSlot` 常量，而本档映射把那些常量留成 `field_*`（未具名）。

### 4. 忘记注册 BlockItem

（详见 `antipatterns/registry.md`）

## 诊断清单

| 检查项 | 方法 |
|--------|------|
| 耐久是否设置 | 检查 `maxDamage`（本档 `Item.Settings` 具名的 `max*` 只有 `maxCount` / `maxDamage`，**没有** `maxDamageIfAbsent`） |
| 食物是否设置 nutrition | 检查 FoodComponent.Builder |
| 工具是否调用 damage() | 检查 postHit / inventoryTick |
