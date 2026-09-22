---
title: "WorldRenderer"
description: "public class WorldRenderer extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/WorldRenderer.html"
sourceType: javadoc
---

# WorldRenderer

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.WorldRenderer

## Class signature

```java
public class WorldRenderer extends java.lang.Object
```

## Constructors

- `WorldRenderer(int bufferSizeIn)`

## Methods

- `void addVertexData(int[] vertexData)`
- `void begin(int glMode, VertexFormat format)`
- `void checkAndGrow()`
- `WorldRenderer color(float red, float green, float blue, float alpha)`
- `WorldRenderer color(int red, int green, int blue, int alpha)`
- `void endVertex()`
- `void finishDrawing()`
- `java.nio.ByteBuffer getByteBuffer()`
- `int getColorIndex(int p_78909_1_)` — Takes in the pass the call list is being requested for.
- `int getDrawMode()`
- `int getVertexCount()`
- `VertexFormat getVertexFormat()`
- `WorldRenderer.State getVertexState()`
- `boolean isColorDisabled()`
- `WorldRenderer lightmap(int p_181671_1_, int p_181671_2_)`
- `void noColor()` — Disabels color processing.
- `WorldRenderer normal(float p_181663_1_, float p_181663_2_, float p_181663_3_)`
- `WorldRenderer pos(double x, double y, double z)`
- `void putBrightness4(int p_178962_1_, int p_178962_2_, int p_178962_3_, int p_178962_4_)`
- `void putColor4(int argb)`
- `void putColorMultiplier(float red, float green, float blue, int p_178978_4_)`
- `void putColorRGB_F(float red, float green, float blue, int p_178994_4_)`
- `void putColorRGB_F4(float red, float green, float blue)`
- `void putColorRGBA(int index, int red, int p_178972_3_, int p_178972_4_, int p_178972_5_)`
- `void putNormal(float x, float y, float z)`
- `void putPosition(double x, double y, double z)`
- `void reset()`
- `void setTranslation(double x, double y, double z)`
- `void setVertexState(WorldRenderer.State state)`
- `void sortVertexData(float p_181674_1_, float p_181674_2_, float p_181674_3_)`
- `WorldRenderer tex(double u, double v)`
