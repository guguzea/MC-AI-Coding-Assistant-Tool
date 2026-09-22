# BlockStatePaletteHashMap

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.BlockStatePaletteHashMap

## Class signature

```java
public class BlockStatePaletteHashMap extends java.lang.Object implements IBlockStatePalette
```

## Constructors

- `BlockStatePaletteHashMap(int bitsIn, net.minecraft.world.chunk.IBlockStatePaletteResizer p_i47089_2_)`

## Methods

- `IBlockState getBlockState(int indexKey)`
- `int getSerializedState()`
- `int idFor(IBlockState state)`
- `void read(PacketBuffer buf)`
- `void write(PacketBuffer buf)`