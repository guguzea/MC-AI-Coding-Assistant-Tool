# ItemTool

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemTool

## Class signature

```java
public class ItemTool extends Item
```

## Constructors

- `ItemTool(float p_i45333_1_, Item.ToolMaterial p_i45333_2_, java.util.Set p_i45333_3_)`

## Methods

- `float func_150893_a(ItemStack p_150893_1_, Block p_150893_2_)`
- `Item.ToolMaterial func_150913_i()`
- `boolean getIsRepairable(ItemStack p_82789_1_, ItemStack p_82789_2_)`
- `Multimap getItemAttributeModifiers()`
- `int getItemEnchantability()`
- `java.lang.String getToolMaterialName()`
- `boolean hitEntity(ItemStack p_77644_1_, EntityLivingBase p_77644_2_, EntityLivingBase p_77644_3_)`
- `boolean isFull3D()`
- `boolean onBlockDestroyed(ItemStack p_150894_1_, World p_150894_2_, Block p_150894_3_, int p_150894_4_, int p_150894_5_, int p_150894_6_, EntityLivingBase p_150894_7_)`

## Fields

- `protected float efficiencyOnProperMaterial`
- `protected Item.ToolMaterial toolMaterial`