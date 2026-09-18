# SaplingGrowTreeEvent

## Class signature

```java
public class SaplingGrowTreeEvent extends WorldEvent
```

## Constructors

- `public SaplingGrowTreeEvent( World world, java.util.Random rand, BlockPos pos)`

## Description

SaplingGrowTreeEvent is fired when a sapling grows into a tree. This event is fired during sapling growth in BlockSapling#func_149878_d(World, BlockPos, Random). pos contains the coordinates of the gr