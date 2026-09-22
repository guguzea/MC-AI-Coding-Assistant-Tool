# DebugRenderer

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.debug.DebugRenderer

## Class signature

```java
public class DebugRenderer extends java.lang.Object
```

## Constructors

- `DebugRenderer(Minecraft clientIn)`

## Methods

- `void renderDebug(float partialTicks, long finishTimeNano)`
- `static void renderDebugText(java.lang.String str, double x, double y, double z, float partialTicks, int color)`
- `boolean shouldRender()`
- `boolean toggleDebugScreen()`

## Fields

- `DebugRenderer.IDebugRenderer debugRendererChunkBorder`
- `DebugRenderer.IDebugRenderer debugRendererHeightMap`
- `DebugRenderer.IDebugRenderer debugRendererPathfinding`
- `DebugRenderer.IDebugRenderer debugRendererWater`