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
- `static void renderDebugText(java.lang.String str, int x, int y, int z, float partialTicks, int color)`
- `boolean shouldRender()`
- `boolean toggleChunkBorders()`

## Fields

- `DebugRenderer.IDebugRenderer chunkBorder`
- `DebugRenderer.IDebugRenderer collisionBox`
- `DebugRenderer.IDebugRenderer heightMap`
- `DebugRenderer.IDebugRenderer neighborsUpdate`
- `DebugRenderer.IDebugRenderer pathfinding`
- `DebugRenderer.IDebugRenderer solidFace`
- `DebugRenderer.IDebugRenderer water`