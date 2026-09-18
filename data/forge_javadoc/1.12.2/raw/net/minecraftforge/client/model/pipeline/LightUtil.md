---
title: "LightUtil"
description: "Deprecated."
package: "net/minecraftforge/client/model/pipeline"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/pipeline/LightUtil.html"
sourceType: javadoc
---

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
- `@Deprecated public static IVertexConsumer getTessellator()`
- `@Deprecated public static LightUtil.ItemConsumer getItemConsumer()`
- `public static void renderQuadColorSlow( BufferBuilder buffer, BakedQuad quad, int auxColor)`
- `public static void renderQuadColor( BufferBuilder buffer, BakedQuad quad, int auxColor)`

## Description

Deprecated.
