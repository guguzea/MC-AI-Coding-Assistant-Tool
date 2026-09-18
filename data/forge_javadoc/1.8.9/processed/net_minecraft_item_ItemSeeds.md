# ItemSeeds

## Class signature

```java
public class ItemSeeds extends Item implements IPlantable
```

## Constructors

- `public ItemSeeds( Block crops, Block soil)`

## Methods

- `public boolean onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public EnumPlantType getPlantType( IBlockAccess world, BlockPos pos)`
- `public IBlockState getPlant( IBlockAccess world, BlockPos pos)`

## Description

Called when a Block is right-clicked with this Item