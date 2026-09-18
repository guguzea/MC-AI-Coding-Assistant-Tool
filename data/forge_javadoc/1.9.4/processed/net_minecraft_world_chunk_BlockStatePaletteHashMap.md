# BlockStatePaletteHashMap

## Class signature

```java
public class BlockStatePaletteHashMap extends java.lang.Object implements IBlockStatePalette
```

## Constructors

- `public BlockStatePaletteHashMap(int bitsIn, net.minecraft.world.chunk.IBlockStatePaletteResizer p_i47089_2_)`

## Methods

- `public int idFor( IBlockState state)`
- `@Nullable public IBlockState getBlockState(int indexKey)`
- `public void read( PacketBuffer buf)`
- `public void write( PacketBuffer buf)`
- `public int getSerializedState()`