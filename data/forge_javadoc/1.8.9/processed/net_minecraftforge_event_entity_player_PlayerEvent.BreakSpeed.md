# PlayerEvent.BreakSpeed

## Constructors

- `public BreakSpeed( EntityPlayer player, IBlockState state, float original, BlockPos pos)`

## Description

BreakSpeed is fired when a player attempts to harvest a block. This event is fired whenever a player attempts to harvest a block in EntityPlayer#canHarvestBlock(Block). This event is fired via the For