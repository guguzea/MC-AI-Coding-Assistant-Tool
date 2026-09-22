---
title: "ItemTextureQuadConverter"
description: "public final class ItemTextureQuadConverter extends java.lang.Object"
package: "net/minecraftforge/client/model"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/client/model/ItemTextureQuadConverter.html"
sourceType: javadoc
---

# ItemTextureQuadConverter

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.ItemTextureQuadConverter

## Class signature

```java
public final class ItemTextureQuadConverter extends java.lang.Object
```

## Methods

- `static java.util.List<UnpackedBakedQuad> convertTexture(VertexFormat format, TRSRTransformation transform, TextureAtlasSprite template, TextureAtlasSprite sprite, float z, EnumFacing facing, int color)` — Takes a texture and converts it into BakedQuads.
- `static java.util.List<UnpackedBakedQuad> convertTextureHorizontal(VertexFormat format, TRSRTransformation transform, TextureAtlasSprite template, TextureAtlasSprite sprite, float z, EnumFacing facing, int color)` — Scans a texture and converts it into a list of horizontal strips stacked on top of each other.
- `static java.util.List<UnpackedBakedQuad> convertTextureVertical(VertexFormat format, TRSRTransformation transform, TextureAtlasSprite template, TextureAtlasSprite sprite, float z, EnumFacing facing, int color)` — Scans a texture and converts it into a list of vertical strips stacked next to each other from left to right.
- `static UnpackedBakedQuad genQuad(VertexFormat format, TRSRTransformation transform, float x1, float y1, float x2, float y2, float z, TextureAtlasSprite sprite, EnumFacing facing, int color)` — Generates a Front/Back quad for an itemmodel.
