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
- `WorldRenderer.State getState()`
- `java.util.List<TileEntity> getTileEntities()`
- `boolean isEmpty()`
- `boolean isLayerEmpty(EnumWorldBlockLayer layer)`
- `boolean isLayerStarted(EnumWorldBlockLayer layer)`
- `boolean isVisible(EnumFacing facing, EnumFacing facing2)`
- `void setLayerStarted(EnumWorldBlockLayer layer)`
- `protected void setLayerUsed(EnumWorldBlockLayer layer)`
- `void setState(WorldRenderer.State stateIn)`
- `void setVisibility(SetVisibility visibility)`

## Fields

- `static CompiledChunk DUMMY`