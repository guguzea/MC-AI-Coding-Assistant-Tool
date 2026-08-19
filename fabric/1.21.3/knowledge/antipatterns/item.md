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
// ❌ 默认 durability 为 Integer.MAX_VALUE，物品永远不会消耗
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
        .saturationModifier(1.0f)  // ❌ 忘记 .hunger()
        .build())
);
```

**正确方案：**
```java
new Item(new Item.Settings().food(
    new FoodComponent.Builder()
        .hunger(4)  // ✅ 必须设置
        .saturationModifier(1.0f)
        .build())
);
```

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
        stack.damage(1, attacker, (entity) -> {
            entity.sendToolBreakStatus(attacker.getActiveHand());
        });
        return true;
    }
}
```

### 4. 忘记注册 BlockItem

（详见 `antipatterns/registry.md`）

## 诊断清单

| 检查项 | 方法 |
|--------|------|
| 耐久是否设置 | 检查 `maxDamage` 或 `maxDamageIfAbsent` |
| 食物是否设置 hunger | 检查 FoodComponent.Builder |
| 工具是否调用 damage() | 检查 postHit / inventoryTick |
