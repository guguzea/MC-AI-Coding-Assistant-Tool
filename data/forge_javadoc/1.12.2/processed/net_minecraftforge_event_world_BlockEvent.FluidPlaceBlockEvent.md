# BlockEvent.FluidPlaceBlockEvent

## Constructors

- `public FluidPlaceBlockEvent( World world, BlockPos pos, BlockPos liquidPos, IBlockState state)`

## Methods

- `public BlockPos getLiquidPos()`
- `public IBlockState getNewState()`
- `public void setNewState( IBlockState state)`
- `public IBlockState getOriginalState()`

## Description

Fired when a liquid places a block. Use setNewState(IBlockState) to change the result of a cobblestone generator or add variants of obsidian. Alternatively, you could execute arbitrary code when lava