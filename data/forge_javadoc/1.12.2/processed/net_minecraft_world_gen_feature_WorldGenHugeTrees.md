# WorldGenHugeTrees

## Class signature

```java
public abstract class WorldGenHugeTrees extends WorldGenAbstractTree
```

## Constructors

- `public WorldGenHugeTrees(boolean notify, int baseHeightIn, int extraRandomHeightIn, IBlockState woodMetadataIn, IBlockState leavesMetadataIn)`

## Methods

- `protected int getHeight(java.util.Random rand)`
- `protected boolean ensureGrowable( World worldIn, java.util.Random rand, BlockPos treePos, int height)`
- `protected void growLeavesLayerStrict( World worldIn, BlockPos layerCenter, int width)`
- `protected void growLeavesLayer( World worldIn, BlockPos layerCenter, int width)`