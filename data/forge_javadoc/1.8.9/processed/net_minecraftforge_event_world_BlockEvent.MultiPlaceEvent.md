# BlockEvent.MultiPlaceEvent

## Constructors

- `public MultiPlaceEvent(java.util.List< BlockSnapshot > blockSnapshots, IBlockState placedAgainst, EntityPlayer player)`

## Methods

- `public java.util.List< BlockSnapshot > getReplacedBlockSnapshots()`

## Description

Fired when a single block placement action of a player triggers the creation of multiple blocks(e.g. placing a bed block). The block returned by BlockEvent.state and its related methods is the block w