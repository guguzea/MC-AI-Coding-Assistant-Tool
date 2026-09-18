---
title: "BufferBuilder"
description: "public class BufferBuilder extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/BufferBuilder.html"
sourceType: javadoc
---

# BufferBuilder

## Class signature

```java
public class BufferBuilder extends java.lang.Object
```

## Constructors

- `public BufferBuilder(int bufferSizeIn)`

## Methods

- `public void sortVertexData(float p_181674_1_, float p_181674_2_, float p_181674_3_)`
- `public BufferBuilder.State getVertexState()`
- `public void setVertexState( BufferBuilder.State state)`
- `public void reset()`
- `public void begin(int glMode, VertexFormat format)`
- `public BufferBuilder tex(double u, double v)`
- `public BufferBuilder lightmap(int p_187314_1_, int p_187314_2_)`
- `public void putBrightness4(int p_178962_1_, int p_178962_2_, int p_178962_3_, int p_178962_4_)`
- `public void putPosition(double x, double y, double z)`
- `public int getColorIndex(int vertexIndex)`
- `public void putColorMultiplier(float red, float green, float blue, int vertexIndex)`
- `public void putColorRGB_F(float red, float green, float blue, int vertexIndex)`
- `public void putColorRGBA(int index, int red, int green, int blue)`
- `public void noColor()`
- `public BufferBuilder color(float red, float green, float blue, float alpha)`
- `public BufferBuilder color(int red, int green, int blue, int alpha)`
- `public void addVertexData(int[] vertexData)`
- `public void endVertex()`
- `public BufferBuilder pos(double x, double y, double z)`
- `public void putNormal(float x, float y, float z)`
- `public BufferBuilder normal(float x, float y, float z)`
- `public void setTranslation(double x, double y, double z)`
- `public void finishDrawing()`
- `public java.nio.ByteBuffer getByteBuffer()`
- `public VertexFormat getVertexFormat()`
- `public int getVertexCount()`
- `public int getDrawMode()`
- `public void putColor4(int argb)`
- `public void putColorRGB_F4(float red, float green, float blue)`
- `public void putColorRGBA(int index, int red, int green, int blue, int alpha)`
- `public boolean isColorDisabled()`
- `public void putBulkData(java.nio.ByteBuffer buffer)`
