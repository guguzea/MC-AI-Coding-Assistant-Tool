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
- `NibbleArray getBlocklightArray()`
- `BlockStateContainer getData()`
- `int getExtBlocklightValue(int x, int y, int z)`
- `int getExtSkylightValue(int x, int y, int z)`
- `boolean getNeedsRandomTick()`
- `NibbleArray getSkylightArray()`
- `int getYLocation()`
- `boolean isEmpty()`
- `void removeInvalidBlocks()`
- `void set(int x, int y, int z, IBlockState state)`
- `void setBlocklightArray(NibbleArray newBlocklightArray)`
- `void setExtBlocklightValue(int x, int y, int z, int value)`
- `void setExtSkylightValue(int x, int y, int z, int value)`
- `void setSkylightArray(NibbleArray newSkylightArray)`