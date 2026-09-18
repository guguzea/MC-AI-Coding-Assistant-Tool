# DemoWorldManager

## Class signature

```java
public class DemoWorldManager extends PlayerInteractionManager
```

## Constructors

- `public DemoWorldManager( World worldIn)`

## Methods

- `public void updateBlockRemoving()`
- `public void onBlockClicked( BlockPos pos, EnumFacing side)`
- `public void blockRemoving( BlockPos pos)`
- `public boolean tryHarvestBlock( BlockPos pos)`
- `public EnumActionResult processRightClick( EntityPlayer player, World worldIn, ItemStack stack, EnumHand hand)`
- `public EnumActionResult processRightClickBlock( EntityPlayer player, World worldIn, @Nullable ItemStack stack, EnumHand hand, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ)`