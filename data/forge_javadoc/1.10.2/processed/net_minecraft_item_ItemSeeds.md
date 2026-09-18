# ItemSeeds

## Class signature

```java
public class ItemSeeds extends Item implements IPlantable
```

## Constructors

- `public ItemSeeds( Block crops, Block soil)`

## Methods

- `public EnumActionResult onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public EnumPlantType getPlantType( IBlockAccess world, BlockPos pos)`
- `public IBlockState getPlant( IBlockAccess world, BlockPos pos)`