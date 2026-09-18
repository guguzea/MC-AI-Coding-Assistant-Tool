# ItemHoe

## Class signature

```java
public class ItemHoe extends Item
```

## Constructors

- `public ItemHoe( Item.ToolMaterial material)`

## Methods

- `public boolean onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)`
- `protected boolean useHoe( ItemStack stack, EntityPlayer player, World worldIn, BlockPos target, IBlockState newState)`
- `public boolean isFull3D()`
- `public java.lang.String getMaterialName()`

## Description

Returns the name of the material this tool is made from as it is declared in EnumToolMaterial (meaning diamond would return "EMERALD")