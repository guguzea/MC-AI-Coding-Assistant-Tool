# LightUtil

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.pipeline.LightUtil

## Class signature

```java
public class LightUtil extends java.lang.Object
```

## Constructors

- `LightUtil()`

## Methods

- `static float diffuseLight(EnumFacing side)`
- `static float diffuseLight(float x, float y, float z)`
- `@Deprecated static LightUtil.ItemConsumer getItemConsumer()`
- `@Deprecated static IVertexConsumer getTessellator()`
- `static int[] mapFormats(VertexFormat from, VertexFormat to)`
- `static void pack(float[] from, int[] to, VertexFormat formatTo, int v, int e)`
- `static void putBakedQuad(IVertexConsumer consumer, BakedQuad quad)`
- `static void renderQuadColor(BufferBuilder buffer, BakedQuad quad, int auxColor)`
- `static void renderQuadColorSlow(BufferBuilder buffer, BakedQuad quad, int auxColor)`
- `static EnumFacing toSide(float x, float y, float z)`
- `static void unpack(int[] from, float[] to, VertexFormat formatFrom, int v, int e)`