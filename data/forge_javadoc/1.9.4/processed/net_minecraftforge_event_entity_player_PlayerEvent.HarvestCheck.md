# PlayerEvent.HarvestCheck

## Constructors

- `public HarvestCheck( EntityPlayer player, IBlockState state, boolean success)`

## Methods

- `public IBlockState getTargetBlock()`
- `public boolean canHarvest()`
- `public void setCanHarvest(boolean success)`

## Description

HarvestCheck is fired when a player attempts to harvest a block. This event is fired whenever a player attempts to harvest a block in EntityPlayer#canHarvestBlock(Block). This event is fired via the F