# BlockEvent.BreakEvent

## Constructors

- `public BreakEvent( World world, BlockPos pos, IBlockState state, EntityPlayer player)`

## Methods

- `public EntityPlayer getPlayer()`
- `public int getExpToDrop()`
- `public void setExpToDrop(int exp)`

## Description

Event that is fired when an Block is about to be broken by a player Canceling this event will prevent the Block from being broken.