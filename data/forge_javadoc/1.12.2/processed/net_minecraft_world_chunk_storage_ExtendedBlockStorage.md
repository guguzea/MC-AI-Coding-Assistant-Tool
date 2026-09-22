# ExtendedBlockStorage

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.storage.ExtendedBlockStorage

## Class signature

```java
public class ExtendedBlockStorage extends java.lang.Object
```

## Constructors

- `ExtendedBlockStorage(int y, boolean storeSkylight)`

## Methods

- `IBlockState get(int x, int y, int z)`
- `NibbleArray getBlockLight()`
- `int getBlockLight(int x, int y, int z)`
- `BlockStateContainer getData()`
- `NibbleArray getSkyLight()`
- `int getSkyLight(int x, int y, int z)`
- `int getYLocation()`
- `boolean isEmpty()`
- `boolean needsRandomTick()`
- `void recalculateRefCounts()`
- `void set(int x, int y, int z, IBlockState state)`
- `void setBlockLight(int x, int y, int z, int value)`
- `void setBlockLight(NibbleArray newBlocklightArray)`
- `void setSkyLight(int x, int y, int z, int value)`
- `void setSkyLight(NibbleArray newSkylightArray)`