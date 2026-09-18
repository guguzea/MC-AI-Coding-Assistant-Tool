# ItemTool

## Class signature

```java
public class ItemTool extends Item
```

## Constructors

- `protected ItemTool(float attackDamage, Item.ToolMaterial material, java.util.Set< Block > effectiveBlocks)`

## Methods

- `public float getStrVsBlock( ItemStack stack, Block block)`
- `public boolean hitEntity( ItemStack stack, EntityLivingBase target, EntityLivingBase attacker)`
- `public boolean onBlockDestroyed( ItemStack stack, World worldIn, Block blockIn, BlockPos pos, EntityLivingBase playerIn)`
- `public boolean isFull3D()`
- `public Item.ToolMaterial getToolMaterial()`
- `public int getItemEnchantability()`
- `public java.lang.String getToolMaterialName()`
- `public boolean getIsRepairable( ItemStack toRepair, ItemStack repair)`
- `public <any> getItemAttributeModifiers()`
- `public int getHarvestLevel( ItemStack stack, java.lang.String toolClass)`
- `public java.util.Set<java.lang.String> getToolClasses( ItemStack stack)`
- `public float getDigSpeed( ItemStack stack, IBlockState state)`

## Description

The material this tool is made from.