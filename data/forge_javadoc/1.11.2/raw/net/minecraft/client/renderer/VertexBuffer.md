---
title: "VertexBuffer"
description: "public class VertexBuffer extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/renderer/VertexBuffer.html"
sourceType: javadoc
---

# VertexBuffer

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.VertexBuffer

## Class signature

```java
public class VertexBuffer extends java.lang.Object
```

## Constructors

- `VertexBuffer(int bufferSizeIn)`

## Methods

- `void addVertexData(int[] vertexData)`
- `void begin(int glMode, VertexFormat format)`
- `VertexBuffer color(float red, float green, float blue, float alpha)`
- `VertexBuffer color(int red, int green, int blue, int alpha)`
- `void endVertex()`
- `void finishDrawing()`
- `java.nio.ByteBuffer getByteBuffer()`
- `int getColorIndex(int vertexIndex)`
- `int getDrawMode()`
- `int getVertexCount()`
- `VertexFormat getVertexFormat()`
- `VertexBuffer.State getVertexState()`
- `boolean isColorDisabled()`
- `VertexBuffer lightmap(int p_187314_1_, int p_187314_2_)`
- `void noColor()`
- `VertexBuffer normal(float x, float y, float z)`
- `VertexBuffer pos(double x, double y, double z)`
- `void putBrightness4(int p_178962_1_, int p_178962_2_, int p_178962_3_, int p_178962_4_)`
- `void putColor4(int argb)`
- `void putColorMultiplier(float red, float green, float blue, int vertexIndex)`
- `void putColorRGB_F(float red, float green, float blue, int vertexIndex)`
- `void putColorRGB_F4(float red, float green, float blue)`
- `void putColorRGBA(int index, int red, int green, int blue, int alpha)`
- `void putNormal(float x, float y, float z)`
- `void putPosition(double x, double y, double z)`
- `void reset()`
- `void setTranslation(double x, double y, double z)`
- `void setVertexState(VertexBuffer.State state)`
- `void sortVertexData(float p_181674_1_, float p_181674_2_, float p_181674_3_)`
- `VertexBuffer tex(double u, double v)`
