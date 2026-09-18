# BlockColors

## Class signature

```java
public class BlockColors extends java.lang.Object
```

## Constructors

- `public BlockColors()`

## Methods

- `public static BlockColors init()`
- `public int getColor( IBlockState state)`
- `public int colorMultiplier( IBlockState state, @Nullable IBlockAccess blockAccess, @Nullable BlockPos pos, int renderPass)`
- `public void registerBlockColorHandler( IBlockColor blockColor, Block ... blocksIn)`