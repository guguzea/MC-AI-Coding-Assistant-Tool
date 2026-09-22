# ItemBucketMilk

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemBucketMilk

## Class signature

```java
public class ItemBucketMilk extends Item
```

## Methods

- `EnumAction getItemUseAction(ItemStack stack)` — returns the action that specifies what animation to play when the items is being used
- `int getMaxItemUseDuration(ItemStack stack)` — How long it takes to use or consume an item
- `ItemStack onItemRightClick(ItemStack itemStackIn, World worldIn, EntityPlayer playerIn)` — Called whenever this item is equipped and the right mouse button is pressed.
- `ItemStack onItemUseFinish(ItemStack stack, World worldIn, EntityPlayer playerIn)` — Called when the player finishes using this Item (E.g. finishes eating.).

## Fields

- `ItemBucketMilk`