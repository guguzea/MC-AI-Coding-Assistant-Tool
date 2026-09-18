# ItemTool

## Class signature

```java
public class ItemTool extends Item
```

## Constructors

- `protected ItemTool(float attackDamageIn, float attackSpeedIn, Item.ToolMaterial materialIn, java.util.Set< Block > effectiveBlocksIn)`
- `protected ItemTool( Item.ToolMaterial materialIn, java.util.Set< Block > effectiveBlocksIn)`

## Methods

- `public float getStrVsBlock( ItemStack stack, IBlockState state)`
- `public boolean hitEntity( ItemStack stack, EntityLivingBase target, EntityLivingBase attacker)`
- `public boolean onBlockDestroyed( ItemStack stack, World worldIn, IBlockState state, BlockPos pos, EntityLivingBase entityLiving)`
- `public boolean isFull3D()`
- `public Item.ToolMaterial getToolMaterial()`
- `public int getItemEnchantability()`
- `public java.lang.String getToolMaterialName()`
- `public boolean getIsRepairable( ItemStack toRepair, ItemStack repair)`
- `public com.google.common.collect.Multimap<java.lang.String, AttributeModifier > getItemAttributeModifiers( EntityEquipmentSlot equipmentSlot)`
- `public int getHarvestLevel( ItemStack stack, java.lang.String toolClass)`
- `public java.util.Set<java.lang.String> getToolClasses( ItemStack stack)`

## Description

Deprecated, Use the position aware variant instead