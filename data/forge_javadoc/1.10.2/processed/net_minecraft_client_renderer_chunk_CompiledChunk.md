# CompiledChunk

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.chunk.CompiledChunk

## Class signature

```java
public class CompiledChunk extends java.lang.Object
```

## Constructors

- `CompiledChunk()`

## Methods

- `void addTileEntity(TileEntity tileEntityIn)`
- `VertexBuffer.State getState()`
- `java.util.List<TileEntity> getTileEntities()`
- `boolean isEmpty()`
- `boolean isLayerEmpty(BlockRenderLayer layer)`
- `boolean isLayerStarted(BlockRenderLayer layer)`
- `boolean isVisible(EnumFacing facing, EnumFacing facing2)`
- `void setLayerStarted(BlockRenderLayer layer)`
- `protected void setLayerUsed(BlockRenderLayer layer)`
- `void setState(VertexBuffer.State stateIn)`
- `void setVisibility(SetVisibility visibility)`

## Fields

- `static CompiledChunk DUMMY`