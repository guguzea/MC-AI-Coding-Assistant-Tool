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
- `protected void drawNameplate(T te, java.lang.String str, double x, double y, double z, int maxDistance)`
- `FontRenderer getFontRenderer()`
- `protected World getWorld()`
- `boolean isGlobalRenderer(T te)`
- `void render(T te, double x, double y, double z, float partialTicks, int destroyStage, float alpha)`
- `void renderTileEntityFast(T te, double x, double y, double z, float partialTicks, int destroyStage, float partial, BufferBuilder buffer)`
- `protected void setLightmapDisabled(boolean disabled)`
- `void setRendererDispatcher(TileEntityRendererDispatcher rendererDispatcherIn)`

## Fields

- `protected static ResourceLocation [] DESTROY_STAGES`
- `protected TileEntityRendererDispatcher rendererDispatcher`