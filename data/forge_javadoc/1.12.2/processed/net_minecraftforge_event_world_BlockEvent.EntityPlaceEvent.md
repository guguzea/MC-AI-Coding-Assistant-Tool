# BlockEvent.EntityPlaceEvent

## Constructors

- `public EntityPlaceEvent( BlockSnapshot blockSnapshot, IBlockState placedAgainst, Entity entity)`

## Methods

- `public Entity getEntity()`
- `public BlockSnapshot getBlockSnapshot()`
- `public IBlockState getPlacedBlock()`
- `public IBlockState getPlacedAgainst()`

## Description

Called when a block is placed. If a Block Place event is cancelled, the block will not be placed.