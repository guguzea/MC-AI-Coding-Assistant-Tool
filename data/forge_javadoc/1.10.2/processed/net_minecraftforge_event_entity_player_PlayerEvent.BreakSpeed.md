# PlayerEvent.BreakSpeed

## Constructors

- `public BreakSpeed( EntityPlayer player, IBlockState state, float original, BlockPos pos)`

## Methods

- `public IBlockState getState()`
- `public float getOriginalSpeed()`
- `public float getNewSpeed()`
- `public void setNewSpeed(float newSpeed)`
- `public BlockPos getPos()`

## Description

BreakSpeed is fired when a player attempts to harvest a block. This event is fired whenever a player attempts to harvest a block in EntityPlayer.canHarvestBlock(IBlockState) . This event is fired via