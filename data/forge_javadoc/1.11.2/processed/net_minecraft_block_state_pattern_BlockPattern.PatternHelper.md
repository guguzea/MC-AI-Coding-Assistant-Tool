# BlockPattern.PatternHelper

**Inheritance:** java.lang.Object → net.minecraft.block.state.pattern.BlockPattern.PatternHelper

## Class signature

```java
public static class BlockPattern.PatternHelper extends java.lang.Object
```

## Constructors

- `PatternHelper(BlockPos posIn, EnumFacing fingerIn, EnumFacing thumbIn, com.google.common.cache.LoadingCache<BlockPos, BlockWorldState> lcacheIn, int widthIn, int heightIn, int depthIn)`

## Methods

- `EnumFacing getForwards()`
- `BlockPos getFrontTopLeft()`
- `int getHeight()`
- `EnumFacing getUp()`
- `int getWidth()`
- `java.lang.String toString()`
- `BlockWorldState translateOffset(int palmOffset, int thumbOffset, int fingerOffset)`