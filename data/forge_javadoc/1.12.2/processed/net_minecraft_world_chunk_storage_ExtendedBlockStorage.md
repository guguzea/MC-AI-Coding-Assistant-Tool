# ExtendedBlockStorage

## Class signature

```java
public class ExtendedBlockStorage extends java.lang.Object
```

## Constructors

- `public ExtendedBlockStorage(int y, boolean storeSkylight)`

## Methods

- `public IBlockState get(int x, int y, int z)`
- `public void set(int x, int y, int z, IBlockState state)`
- `public boolean isEmpty()`
- `public boolean needsRandomTick()`
- `public int getYLocation()`
- `public void setSkyLight(int x, int y, int z, int value)`
- `public int getSkyLight(int x, int y, int z)`
- `public void setBlockLight(int x, int y, int z, int value)`
- `public int getBlockLight(int x, int y, int z)`
- `public void recalculateRefCounts()`
- `public BlockStateContainer getData()`
- `public NibbleArray getBlockLight()`
- `public NibbleArray getSkyLight()`
- `public void setBlockLight( NibbleArray newBlocklightArray)`
- `public void setSkyLight( NibbleArray newSkylightArray)`