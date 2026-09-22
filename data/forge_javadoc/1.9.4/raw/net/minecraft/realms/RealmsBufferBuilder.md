---
title: "RealmsBufferBuilder"
description: "public class RealmsBufferBuilder extends java.lang.Object"
package: "net/minecraft/realms"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/realms/RealmsBufferBuilder.html"
sourceType: javadoc
---

# RealmsBufferBuilder

**Inheritance:** java.lang.Object → net.minecraft.realms.RealmsBufferBuilder

## Class signature

```java
public class RealmsBufferBuilder extends java.lang.Object
```

## Constructors

- `RealmsBufferBuilder(VertexBuffer p_i46442_1_)`

## Methods

- `void begin(int p_begin_1_, VertexFormat p_begin_2_)`
- `void clear()`
- `RealmsBufferBuilder color(float p_color_1_, float p_color_2_, float p_color_3_, float p_color_4_)`
- `RealmsBufferBuilder color(int p_color_1_, int p_color_2_, int p_color_3_, int p_color_4_)`
- `void end()`
- `void endVertex()`
- `void faceTex2(int p_faceTex2_1_, int p_faceTex2_2_, int p_faceTex2_3_, int p_faceTex2_4_)`
- `void faceTint(float p_faceTint_1_, float p_faceTint_2_, float p_faceTint_3_, int p_faceTint_4_)`
- `void fixupQuadColor(float p_fixupQuadColor_1_, float p_fixupQuadColor_2_, float p_fixupQuadColor_3_)`
- `void fixupQuadColor(int p_fixupQuadColor_1_)`
- `void fixupVertexColor(float p_fixupVertexColor_1_, float p_fixupVertexColor_2_, float p_fixupVertexColor_3_, int p_fixupVertexColor_4_)`
- `RealmsBufferBuilder from(VertexBuffer p_from_1_)`
- `java.nio.ByteBuffer getBuffer()`
- `int getDrawMode()`
- `int getVertexCount()`
- `RealmsVertexFormat getVertexFormat()`
- `void noColor()`
- `RealmsBufferBuilder normal(float p_normal_1_, float p_normal_2_, float p_normal_3_)`
- `void offset(double p_offset_1_, double p_offset_3_, double p_offset_5_)`
- `void postNormal(float p_postNormal_1_, float p_postNormal_2_, float p_postNormal_3_)`
- `void postProcessFacePosition(double p_postProcessFacePosition_1_, double p_postProcessFacePosition_3_, double p_postProcessFacePosition_5_)`
- `void putBulkData(int[] p_putBulkData_1_)`
- `void restoreState(VertexBuffer.State p_restoreState_1_)`
- `void sortQuads(float p_sortQuads_1_, float p_sortQuads_2_, float p_sortQuads_3_)`
- `RealmsBufferBuilder tex(double p_tex_1_, double p_tex_3_)`
- `RealmsBufferBuilder tex2(int p_tex2_1_, int p_tex2_2_)`
- `RealmsBufferBuilder vertex(double p_vertex_1_, double p_vertex_3_, double p_vertex_5_)`
