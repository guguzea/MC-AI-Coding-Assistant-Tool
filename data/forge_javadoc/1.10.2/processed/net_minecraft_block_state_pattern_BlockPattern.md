# BlockPattern

**Inheritance:** java.lang.Object → net.minecraft.block.state.pattern.BlockPattern

## Class signature

```java
public class BlockPattern extends java.lang.Object
```

## Constructors

- `BlockPattern(com.google.common.base.Predicate<BlockWorldState>[][][] predicatesIn)`

## Methods

- `static com.google.common.cache.LoadingCache<BlockPos, BlockWorldState> createLoadingCache(World worldIn, boolean forceLoadIn)`
- `int getFingerLength()`
- `int getPalmLength()`
- `int getThumbLength()`
- `BlockPattern.PatternHelper match(World worldIn, BlockPos pos)`
- `protected static BlockPos translateOffset(BlockPos pos, EnumFacing finger, EnumFacing thumb, int palmOffset, int thumbOffset, int fingerOffset)`