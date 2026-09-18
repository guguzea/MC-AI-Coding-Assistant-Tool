# SaplingGrowTreeEvent

## Class signature

```java
public class SaplingGrowTreeEvent extends WorldEvent
```

## Constructors

- `public SaplingGrowTreeEvent( World world, java.util.Random rand, BlockPos pos)`

## Methods

- `public BlockPos getPos()`
- `public java.util.Random getRand()`

## Description

SaplingGrowTreeEvent is fired when a sapling grows into a tree. This event is fired during sapling growth in BlockSapling.generateTree(World, BlockPos, IBlockState, Random) . pos contains the coordina