# DemoWorldManager

## Class signature

```java
public class DemoWorldManager extends ItemInWorldManager
```

## Constructors

- `public DemoWorldManager( World worldIn)`

## Methods

- `public void updateBlockRemoving()`
- `public void onBlockClicked( BlockPos pos, EnumFacing side)`
- `public void blockRemoving( BlockPos pos)`
- `public boolean tryHarvestBlock( BlockPos pos)`
- `public boolean tryUseItem( EntityPlayer player, World worldIn, ItemStack stack)`
- `public boolean activateBlockOrUseItem( EntityPlayer player, World worldIn, ItemStack stack, BlockPos pos, EnumFacing side, float offsetX, float offsetY, float offsetZ)`

## Description

Activate the clicked on block, otherwise use the held item.