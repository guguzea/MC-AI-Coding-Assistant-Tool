# BlockStateContainer

## Class signature

```java
public class BlockStateContainer extends java.lang.Object
```

## Constructors

- `public BlockStateContainer()`

## Methods

- `public int onResize(int bits, IBlockState state)`
- `public void set(int x, int y, int z, IBlockState state)`
- `protected void set(int index, IBlockState state)`
- `public IBlockState get(int x, int y, int z)`
- `protected IBlockState get(int index)`
- `public void read( PacketBuffer buf)`
- `public void write( PacketBuffer buf)`
- `@Nullable public NibbleArray getDataForNBT(byte[] p_186017_1_, NibbleArray p_186017_2_)`
- `public void setDataFromNBT(byte[] p_186019_1_, NibbleArray p_186019_2_, @Nullable NibbleArray p_186019_3_)`
- `public int getSerializedSize()`