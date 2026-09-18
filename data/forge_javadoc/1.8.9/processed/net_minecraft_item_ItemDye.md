# ItemDye

## Class signature

```java
public class ItemDye extends Item
```

## Constructors

- `public ItemDye()`

## Methods

- `public java.lang.String getUnlocalizedName( ItemStack stack)`
- `public boolean onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public static boolean applyBonemeal( ItemStack stack, World worldIn, BlockPos target)`
- `public static boolean applyBonemeal( ItemStack stack, World worldIn, BlockPos target, EntityPlayer player)`
- `public static void spawnBonemealParticles( World worldIn, BlockPos pos, int amount)`
- `public boolean itemInteractionForEntity( ItemStack stack, EntityPlayer playerIn, EntityLivingBase target)`
- `public void getSubItems( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > subItems)`

## Description

returns a list of items with the same ID, but different meta (eg: dye returns 16 items)