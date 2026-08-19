---
name: mc-item
description: Minecraft Forge 物品开发。创建物品、工具（剑/镐/斧）、盔甲、食物。触发词：物品、Item、ItemStack、ToolMaterial、ItemSword
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# 物品开发（Forge 1.12.2）

## 快速开始

```java
// 注册（参见 mc-registry Skill）
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModItems {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<Item> event) {
        event.getRegistry().register(
            new Item()
                .setMaxStackSize(64)
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
  → 继承 ItemFood；饱食也能吃用 setAlwaysEdible()

IF 可在创造模式标签中找到
  → .setCreativeTab(CreativeTabs)
```

## 自定义 ToolMaterial（不要实现 `IItemTier`，那是 1.14+）

```java
public static final Item.ToolMaterial MY_MATERIAL = EnumHelper.addToolMaterial(
    "MY_MATERIAL", 3, 1561, 8.0F, 3.0F, 15
);
```

## 剑（Sword）

```java
public class MySword extends ItemSword {
    public MySword(ToolMaterial material) {
        super(material);
        this.setRegistryName(MOD_ID, "my_sword");
        this.setUnlocalizedName("my_sword");
    }
}
```

## 常见错误

- ❌ 使用 `DeferredRegister`（1.12.2 没有）
- ❌ 忘记 `setRegistryName` / 用 `setTranslationKey`（本档是 `setUnlocalizedName`）
- ❌ 把 `Item.ToolMaterial` 当接口实现，或抄 `IItemTier`

## 参考资料

- 详细示例：参见 `03-item.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-registry` | 物品通过 RegistryEvent 注册，ItemBlock 需要方块引用 |
