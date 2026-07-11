# 物品开发（Forge 1.12.2）

## 快速开始

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModItems {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<Item> event) {
        event.getRegistry().register(
            new Item(new Item.Properties().maxStackSize(64))
                .setRegistryName(MOD_ID, "my_item")
        );
    }
}
```

## Decision: 选择物品类型

```
IF 只是手持物品（无特殊行为）
  → Item

IF 剑/工具
  → 继承 ItemSword 或自定义 Item

IF 盔甲
  → 继承 ItemArmor + ArmorMaterial

IF 可食用
  → 继承 Item + onItemRightClick() 中使用 player.getFoodStats()
```

## ToolMaterial 枚举

```java
public enum MyTier implements IItemTier {
    MY_MATERIAL(3, 1561, 8.0f, 3.0f, 15, () -> Ingredient.fromItems(Items.DIAMOND));

    @Override public int getMaxUses() { return 1561; }
    @Override public float getEfficiency() { return 8.0f; }
    @Override public float getAttackDamage() { return 3.0f; }
    @Override public int getHarvestLevel() { return 3; }
    @Override public int getEnchantability() { return 15; }
    @Override public Ingredient getRepairMaterial() { return Ingredient.fromItems(Items.DIAMOND); }
}
```

## 常见错误

- ❌ 使用 `DeferredRegister`（1.12.2 没有）
- ❌ 忘记 `setRegistryName`

## 参考资料

- 详细示例：参见 `03-item.mdc`
