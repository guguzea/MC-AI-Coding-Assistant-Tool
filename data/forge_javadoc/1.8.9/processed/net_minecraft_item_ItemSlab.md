# ItemSlab

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemBlock → net.minecraft.item.ItemSlab

## Class signature

```java
public class ItemSlab extends ItemBlock
```

## Methods

- `boolean canPlaceBlockOnSide(World worldIn, BlockPos pos, EnumFacing side, EntityPlayer player, ItemStack stack)`
- `int getMetadata(int damage)` — Converts the given ItemStack damage value into a metadata value to be placed in the world when this Item is placed as a Block (mostly used with ItemBlocks).
- `java.lang.String getUnlocalizedName(ItemStack stack)` — Returns the unlocalized name of this item.
- `boolean onItemUse(ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)` — Called when a Block is right-clicked with this Item

## Fields

- `ItemSlab`