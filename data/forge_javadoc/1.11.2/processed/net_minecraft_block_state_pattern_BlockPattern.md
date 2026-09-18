# BlockPattern

## Class signature

```java
public class BlockPattern extends java.lang.Object
```

## Constructors

- `public BlockPattern(com.google.common.base.Predicate< BlockWorldState >[][][] predicatesIn)`

## Methods

- `public int getFingerLength()`
- `public int getThumbLength()`
- `public int getPalmLength()`
- `@Nullable public BlockPattern.PatternHelper match( World worldIn, BlockPos pos)`
- `public static com.google.common.cache.LoadingCache< BlockPos , BlockWorldState > createLoadingCache( World worldIn, boolean forceLoadIn)`
- `protected static BlockPos translateOffset( BlockPos pos, EnumFacing finger, EnumFacing thumb, int palmOffset, int thumbOffset, int fingerOffset)`