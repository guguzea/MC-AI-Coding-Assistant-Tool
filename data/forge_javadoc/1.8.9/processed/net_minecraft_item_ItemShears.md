# ItemShears

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemShears

## Class signature

```java
public class ItemShears extends Item
```

## Methods

- `boolean canHarvestBlock(Block blockIn)` — Check whether this Item can harvest the given Block
- `float getStrVsBlock(ItemStack stack, Block block)`
- `boolean itemInteractionForEntity(ItemStack itemstack, EntityPlayer player, EntityLivingBase entity)` — Returns true if the item can be used on the given entity, e.g. shears on sheep.
- `boolean onBlockDestroyed(ItemStack stack, World worldIn, Block blockIn, BlockPos pos, EntityLivingBase playerIn)` — Called when a Block is destroyed using this Item.
- `boolean onBlockStartBreak(ItemStack itemstack, BlockPos pos, EntityPlayer player)` — Called before a block is broken.

## Fields

- `ItemShears`