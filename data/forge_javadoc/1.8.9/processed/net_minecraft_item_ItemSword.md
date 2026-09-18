# ItemSword

## Class signature

```java
public class ItemSword extends Item
```

## Constructors

- `public ItemSword( Item.ToolMaterial material)`

## Methods

- `public float getDamageVsEntity()`
- `public float getStrVsBlock( ItemStack stack, Block block)`
- `public boolean hitEntity( ItemStack stack, EntityLivingBase target, EntityLivingBase attacker)`
- `public boolean onBlockDestroyed( ItemStack stack, World worldIn, Block blockIn, BlockPos pos, EntityLivingBase playerIn)`
- `public boolean isFull3D()`
- `public EnumAction getItemUseAction( ItemStack stack)`
- `public int getMaxItemUseDuration( ItemStack stack)`
- `public ItemStack onItemRightClick( ItemStack itemStackIn, World worldIn, EntityPlayer playerIn)`
- `public boolean canHarvestBlock( Block blockIn)`
- `public int getItemEnchantability()`
- `public java.lang.String getToolMaterialName()`
- `public boolean getIsRepairable( ItemStack toRepair, ItemStack repair)`
- `public <any> getItemAttributeModifiers()`

## Description

Check whether this Item can harvest the given Block