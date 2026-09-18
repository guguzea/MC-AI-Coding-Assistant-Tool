# ItemInWorldManager

## Class signature

```java
public class ItemInWorldManager extends java.lang.Object
```

## Constructors

- `public ItemInWorldManager( World worldIn)`

## Methods

- `public void setGameType( WorldSettings.GameType type)`
- `public WorldSettings.GameType getGameType()`
- `public boolean survivalOrAdventure()`
- `public boolean isCreative()`
- `public void initializeGameType( WorldSettings.GameType type)`
- `public void updateBlockRemoving()`
- `public void onBlockClicked( BlockPos pos, EnumFacing side)`
- `public void blockRemoving( BlockPos pos)`
- `public void cancelDestroyingBlock()`
- `public boolean tryHarvestBlock( BlockPos pos)`
- `public boolean tryUseItem( EntityPlayer player, World worldIn, ItemStack stack)`
- `public boolean activateBlockOrUseItem( EntityPlayer player, World worldIn, ItemStack stack, BlockPos pos, EnumFacing side, float offsetX, float offsetY, float offsetZ)`
- `public void setWorld( WorldServer serverWorld)`
- `public double getBlockReachDistance()`
- `public void setBlockReachDistance(double distance)`

## Description

The world object that this object is connected to.