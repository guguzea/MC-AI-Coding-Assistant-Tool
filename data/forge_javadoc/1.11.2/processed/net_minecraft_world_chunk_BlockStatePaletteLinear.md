# BlockStatePaletteLinear

## Class signature

```java
public class BlockStatePaletteLinear extends java.lang.Object implements IBlockStatePalette
```

## Constructors

- `public BlockStatePaletteLinear(int bitsIn, net.minecraft.world.chunk.IBlockStatePaletteResizer resizeHandlerIn)`

## Methods

- `public int idFor( IBlockState state)`
- `@Nullable public IBlockState getBlockState(int indexKey)`
- `public void read( PacketBuffer buf)`
- `public void write( PacketBuffer buf)`
- `public int getSerializedState()`