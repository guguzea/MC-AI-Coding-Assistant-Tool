---
title: "LightUtil"
description: "public class LightUtil extends java.lang.Object"
package: "net/minecraftforge/client/model/pipeline"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/model/pipeline/LightUtil.html"
sourceType: javadoc
---

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
- `static LightUtil.ItemConsumer getItemConsumer()`
- `static IVertexConsumer getTessellator()`
- `static int[] mapFormats(VertexFormat from, VertexFormat to)`
- `static void pack(float[] from, int[] to, VertexFormat formatTo, int v, int e)`
- `static void putBakedQuad(IVertexConsumer consumer, BakedQuad quad)`
- `static void renderQuadColor(VertexBuffer wr, BakedQuad quad, int auxColor)`
- `static void renderQuadColorSlow(VertexBuffer wr, BakedQuad quad, int auxColor)`
- `static EnumFacing toSide(float x, float y, float z)`
- `static void unpack(int[] from, float[] to, VertexFormat formatFrom, int v, int e)`
