# BlockStatePaletteLinear

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.BlockStatePaletteLinear

## Class signature

```java
public class BlockStatePaletteLinear extends java.lang.Object implements IBlockStatePalette
```

## Constructors

- `BlockStatePaletteLinear(int bitsIn, net.minecraft.world.chunk.IBlockStatePaletteResizer resizeHandlerIn)`

## Methods

- `IBlockState getBlockState(int indexKey)`
- `int getSerializedState()`
- `int idFor(IBlockState state)`
- `void read(PacketBuffer buf)`
- `void write(PacketBuffer buf)`