# BlockEvent.PlaceEvent

## Constructors

- `public PlaceEvent( BlockSnapshot blockSnapshot, IBlockState placedAgainst, EntityPlayer player)`

## Methods

- `public EntityPlayer getPlayer()`
- `public ItemStack getItemInHand()`
- `public BlockSnapshot getBlockSnapshot()`
- `public IBlockState getPlacedBlock()`
- `public IBlockState getPlacedAgainst()`

## Description

Called when a block is placed by a player. If a Block Place event is cancelled, the block will not be placed.