# BufferBuilder

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.BufferBuilder

## Class signature

```java
public class BufferBuilder extends java.lang.Object
```

## Constructors

- `BufferBuilder(int bufferSizeIn)`

## Methods

- `void addVertexData(int[] vertexData)`
- `void begin(int glMode, VertexFormat format)`
- `BufferBuilder color(float red, float green, float blue, float alpha)`
- `BufferBuilder color(int red, int green, int blue, int alpha)`
- `void endVertex()`
- `void finishDrawing()`
- `java.nio.ByteBuffer getByteBuffer()`
- `int getColorIndex(int vertexIndex)`
- `int getDrawMode()`
- `int getVertexCount()`
- `VertexFormat getVertexFormat()`
- `BufferBuilder.State getVertexState()`
- `boolean isColorDisabled()`
- `BufferBuilder lightmap(int p_187314_1_, int p_187314_2_)`
- `void noColor()`
- `BufferBuilder normal(float x, float y, float z)`
- `BufferBuilder pos(double x, double y, double z)`
- `void putBrightness4(int p_178962_1_, int p_178962_2_, int p_178962_3_, int p_178962_4_)`
- `void putBulkData(java.nio.ByteBuffer buffer)`
- `void putColor4(int argb)`
- `void putColorMultiplier(float red, float green, float blue, int vertexIndex)`
- `void putColorRGB_F(float red, float green, float blue, int vertexIndex)`
- `void putColorRGB_F4(float red, float green, float blue)`
- `void putColorRGBA(int index, int red, int green, int blue)`
- `void putColorRGBA(int index, int red, int green, int blue, int alpha)`
- `void putNormal(float x, float y, float z)`
- `void putPosition(double x, double y, double z)`
- `void reset()`
- `void setTranslation(double x, double y, double z)`
- `void setVertexState(BufferBuilder.State state)`
- `void sortVertexData(float p_181674_1_, float p_181674_2_, float p_181674_3_)`
- `BufferBuilder tex(double u, double v)`