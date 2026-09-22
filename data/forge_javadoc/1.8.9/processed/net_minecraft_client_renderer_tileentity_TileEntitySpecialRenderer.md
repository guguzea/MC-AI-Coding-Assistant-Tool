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
- `boolean func_181055_a()`
- `FontRenderer getFontRenderer()`
- `protected World getWorld()`
- `abstract void renderTileEntityAt(T te, double x, double y, double z, float partialTicks, int destroyStage)`
- `void renderTileEntityFast(T te, double x, double y, double z, float partialTicks, int destroyStage, WorldRenderer worldRenderer)`
- `void setRendererDispatcher(TileEntityRendererDispatcher rendererDispatcherIn)`

## Fields

- `protected static ResourceLocation [] DESTROY_STAGES`
- `protected TileEntityRendererDispatcher rendererDispatcher`