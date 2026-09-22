# ItemFishingRod

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemFishingRod

## Class signature

```java
public class ItemFishingRod extends Item
```

## Methods

- `int getItemEnchantability()` — Return the enchantability factor of the item, most of the time is based on material.
- `boolean isFull3D()` — Returns True is the item is renderer in full 3D when hold.
- `boolean isItemTool(ItemStack stack)` — Checks isDamagable and if it cannot be stacked
- `ItemStack onItemRightClick(ItemStack itemStackIn, World worldIn, EntityPlayer playerIn)` — Called whenever this item is equipped and the right mouse button is pressed.
- `boolean shouldRotateAroundWhenRendering()` — Returns true if this item should be rotated by 180 degrees around the Y axis when being held in an entities hands.

## Fields

- `ItemFishingRod`