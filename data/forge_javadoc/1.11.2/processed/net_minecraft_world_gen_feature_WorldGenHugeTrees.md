# WorldGenHugeTrees

**Inheritance:** java.lang.Object → net.minecraft.world.gen.feature.WorldGenerator → net.minecraft.world.gen.feature.WorldGenAbstractTree → net.minecraft.world.gen.feature.WorldGenHugeTrees

## Class signature

```java
public abstract class WorldGenHugeTrees extends WorldGenAbstractTree
```

## Constructors

- `WorldGenHugeTrees(boolean notify, int baseHeightIn, int extraRandomHeightIn, IBlockState woodMetadataIn, IBlockState leavesMetadataIn)`

## Methods

- `protected boolean ensureGrowable(World worldIn, java.util.Random rand, BlockPos treePos, int p_175929_4_)`
- `protected int getHeight(java.util.Random rand)`
- `protected void growLeavesLayer(World worldIn, BlockPos layerCenter, int width)`
- `protected void growLeavesLayerStrict(World worldIn, BlockPos layerCenter, int width)`

## Fields

- `protected int baseHeight`
- `protected int extraRandomHeight`
- `protected IBlockState leavesMetadata`
- `protected IBlockState woodMetadata`