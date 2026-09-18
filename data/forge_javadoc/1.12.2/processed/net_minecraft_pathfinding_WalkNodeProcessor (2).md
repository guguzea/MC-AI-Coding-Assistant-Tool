# WalkNodeProcessor

## Class signature

```java
public class WalkNodeProcessor extends NodeProcessor
```

## Constructors

- `public WalkNodeProcessor()`

## Methods

- `public void init( IBlockAccess sourceIn, EntityLiving mob)`
- `public void postProcess()`
- `public PathPoint getStart()`
- `public PathPoint getPathPointToCoords(double x, double y, double z)`
- `public int findPathOptions( PathPoint [] pathOptions, PathPoint currentPoint, PathPoint targetPoint, float maxDistance)`
- `public PathNodeType getPathNodeType( IBlockAccess blockaccessIn, int x, int y, int z, EntityLiving entitylivingIn, int xSize, int ySize, int zSize, boolean canBreakDoorsIn, boolean canEnterDoorsIn)`
- `public PathNodeType getPathNodeType( IBlockAccess p_193577_1_, int x, int y, int z, int xSize, int ySize, int zSize, boolean canOpenDoorsIn, boolean canEnterDoorsIn, java.util.EnumSet< PathNodeType > p_193577_10_, PathNodeType p_193577_11_, BlockPos p_193577_12_)`
- `public PathNodeType getPathNodeType( IBlockAccess blockaccessIn, int x, int y, int z)`
- `public PathNodeType checkNeighborBlocks( IBlockAccess p_193578_1_, int p_193578_2_, int p_193578_3_, int p_193578_4_, PathNodeType p_193578_5_)`
- `protected PathNodeType getPathNodeTypeRaw( IBlockAccess p_189553_1_, int p_189553_2_, int p_189553_3_, int p_189553_4_)`