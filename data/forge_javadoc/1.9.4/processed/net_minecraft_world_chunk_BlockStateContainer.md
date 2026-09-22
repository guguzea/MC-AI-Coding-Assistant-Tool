# BlockStateContainer

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.BlockStateContainer

## Class signature

```java
public class BlockStateContainer extends java.lang.Object
```

## Constructors

- `BlockStateContainer()`

## Methods

- `protected IBlockState get(int index)`
- `IBlockState get(int x, int y, int z)`
- `NibbleArray getDataForNBT(byte[] p_186017_1_, NibbleArray p_186017_2_)`
- `int getSerializedSize()`
- `int onResize(int p_186008_1_, IBlockState state)`
- `void read(PacketBuffer buf)`
- `protected void set(int index, IBlockState state)`
- `void set(int x, int y, int z, IBlockState state)`
- `void setDataFromNBT(byte[] p_186019_1_, NibbleArray p_186019_2_, NibbleArray p_186019_3_)`
- `void write(PacketBuffer buf)`

## Fields

- `protected static IBlockState AIR_BLOCK_STATE`
- `protected IBlockStatePalette palette`
- `protected BitArray storage`