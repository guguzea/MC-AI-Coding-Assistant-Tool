# ItemTool

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemTool

## Class signature

```java
public class ItemTool extends Item
```

## Constructors

- `ItemTool(float attackDamage, Item.ToolMaterial material, java.util.Set<Block> effectiveBlocks)`

## Methods

- `float getDigSpeed(ItemStack stack, IBlockState state)` — Metadata-sensitive version of getStrVsBlock
- `int getHarvestLevel(ItemStack stack, java.lang.String toolClass)` — Queries the harvest level of this item stack for the specifred tool class, Returns -1 if this tool is not of the specified type
- `boolean getIsRepairable(ItemStack toRepair, ItemStack repair)` — Return whether this item is repairable in an anvil.
- `<any> getItemAttributeModifiers()`
- `int getItemEnchantability()` — Return the enchantability factor of the item, most of the time is based on material.
- `float getStrVsBlock(ItemStack stack, Block block)`
- `java.util.Set<java.lang.String> getToolClasses(ItemStack stack)`
- `Item.ToolMaterial getToolMaterial()`
- `java.lang.String getToolMaterialName()` — Return the name for this tool's material.
- `boolean hitEntity(ItemStack stack, EntityLivingBase target, EntityLivingBase attacker)` — Current implementations of this method in child classes do not use the entry argument beside ev.
- `boolean isFull3D()` — Returns True is the item is renderer in full 3D when hold.
- `boolean onBlockDestroyed(ItemStack stack, World worldIn, Block blockIn, BlockPos pos, EntityLivingBase playerIn)` — Called when a Block is destroyed using this Item.

## Fields

- `protected float efficiencyOnProperMaterial`
- `protected Item.ToolMaterial toolMaterial` — The material this tool is made from.