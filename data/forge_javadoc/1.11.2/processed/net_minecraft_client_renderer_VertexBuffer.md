# VertexBuffer

## Class signature

```java
public class VertexBuffer extends java.lang.Object
```

## Constructors

- `public VertexBuffer(int bufferSizeIn)`

## Methods

- `public void sortVertexData(float p_181674_1_, float p_181674_2_, float p_181674_3_)`
- `public VertexBuffer.State getVertexState()`
- `public void setVertexState( VertexBuffer.State state)`
- `public void reset()`
- `public void begin(int glMode, VertexFormat format)`
- `public VertexBuffer tex(double u, double v)`
- `public VertexBuffer lightmap(int p_187314_1_, int p_187314_2_)`
- `public void putBrightness4(int p_178962_1_, int p_178962_2_, int p_178962_3_, int p_178962_4_)`
- `public void putPosition(double x, double y, double z)`
- `public int getColorIndex(int vertexIndex)`
- `public void putColorMultiplier(float red, float green, float blue, int vertexIndex)`
- `public void putColorRGB_F(float red, float green, float blue, int vertexIndex)`
- `public void putColorRGBA(int index, int red, int green, int blue, int alpha)`
- `public void noColor()`
- `public VertexBuffer color(float red, float green, float blue, float alpha)`
- `public VertexBuffer color(int red, int green, int blue, int alpha)`
- `public void addVertexData(int[] vertexData)`
- `public void endVertex()`
- `public VertexBuffer pos(double x, double y, double z)`
- `public void putNormal(float x, float y, float z)`
- `public VertexBuffer normal(float x, float y, float z)`
- `public void setTranslation(double x, double y, double z)`
- `public void finishDrawing()`
- `public java.nio.ByteBuffer getByteBuffer()`
- `public VertexFormat getVertexFormat()`
- `public int getVertexCount()`
- `public int getDrawMode()`
- `public void putColor4(int argb)`
- `public void putColorRGB_F4(float red, float green, float blue)`
- `public boolean isColorDisabled()`