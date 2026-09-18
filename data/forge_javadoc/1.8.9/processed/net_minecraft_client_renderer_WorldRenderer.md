# WorldRenderer

## Class signature

```java
public class WorldRenderer extends java.lang.Object
```

## Constructors

- `public WorldRenderer(int bufferSizeIn)`

## Methods

- `public void sortVertexData(float p_181674_1_, float p_181674_2_, float p_181674_3_)`
- `public WorldRenderer.State getVertexState()`
- `public void setVertexState( WorldRenderer.State state)`
- `public void reset()`
- `public void begin(int glMode, VertexFormat format)`
- `public WorldRenderer tex(double u, double v)`
- `public WorldRenderer lightmap(int p_181671_1_, int p_181671_2_)`
- `public void putBrightness4(int p_178962_1_, int p_178962_2_, int p_178962_3_, int p_178962_4_)`
- `public void putPosition(double x, double y, double z)`
- `public int getColorIndex(int p_78909_1_)`
- `public void putColorMultiplier(float red, float green, float blue, int p_178978_4_)`
- `public void putColorRGB_F(float red, float green, float blue, int p_178994_4_)`
- `public void putColorRGBA(int index, int red, int p_178972_3_, int p_178972_4_, int p_178972_5_)`
- `public void noColor()`
- `public WorldRenderer color(float red, float green, float blue, float alpha)`
- `public WorldRenderer color(int red, int green, int blue, int alpha)`
- `public void addVertexData(int[] vertexData)`
- `public void endVertex()`
- `public WorldRenderer pos(double x, double y, double z)`
- `public void putNormal(float x, float y, float z)`
- `public WorldRenderer normal(float p_181663_1_, float p_181663_2_, float p_181663_3_)`
- `public void setTranslation(double x, double y, double z)`
- `public void finishDrawing()`
- `public java.nio.ByteBuffer getByteBuffer()`
- `public VertexFormat getVertexFormat()`
- `public int getVertexCount()`
- `public int getDrawMode()`
- `public void putColor4(int argb)`
- `public void putColorRGB_F4(float red, float green, float blue)`
- `public void checkAndGrow()`
- `public boolean isColorDisabled()`

## Description

Takes in the pass the call list is being requested for.