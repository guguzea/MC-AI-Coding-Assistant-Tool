# LightUtil

## Class signature

```java
public class LightUtil extends java.lang.Object
```

## Constructors

- `public LightUtil()`

## Methods

- `public static float diffuseLight(float x, float y, float z)`
- `public static float diffuseLight( EnumFacing side)`
- `public static EnumFacing toSide(float x, float y, float z)`
- `public static void putBakedQuad( IVertexConsumer consumer, BakedQuad quad)`
- `public static int[] mapFormats( VertexFormat from, VertexFormat to)`
- `public static void unpack(int[] from, float[] to, VertexFormat formatFrom, int v, int e)`
- `public static void pack(float[] from, int[] to, VertexFormat formatTo, int v, int e)`
- `public static IVertexConsumer getTessellator()`
- `public static LightUtil.ItemConsumer getItemConsumer()`
- `public static void renderQuadColorSlow( WorldRenderer wr, BakedQuad quad, int auxColor)`
- `public static void renderQuadColor( WorldRenderer wr, BakedQuad quad, int auxColor)`