# TileEntitySpecialRenderer

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.tileentity.TileEntitySpecialRenderer<T>

## Class signature

```java
public abstract class TileEntitySpecialRenderer<T extends TileEntity> extends java.lang.Object
```

## Constructors

- `TileEntitySpecialRenderer()`

## Methods

- `protected void bindTexture(ResourceLocation location)`
- `FontRenderer getFontRenderer()`
- `protected World getWorld()`
- `boolean isGlobalRenderer(T te)`
- `abstract void renderTileEntityAt(T te, double x, double y, double z, float partialTicks, int destroyStage)`
- `void renderTileEntityFast(T te, double x, double y, double z, float partialTicks, int destroyStage, VertexBuffer buffer)`
- `void setRendererDispatcher(TileEntityRendererDispatcher rendererDispatcherIn)`

## Fields

- `protected static ResourceLocation [] DESTROY_STAGES`
- `protected TileEntityRendererDispatcher rendererDispatcher`