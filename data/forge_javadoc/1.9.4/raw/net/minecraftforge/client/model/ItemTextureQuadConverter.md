---
title: "ItemTextureQuadConverter"
description: "Takes a texture and converts it into BakedQuads."
package: "net/minecraftforge/client/model"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/client/model/ItemTextureQuadConverter.html"
sourceType: javadoc
---

# ItemTextureQuadConverter

## Class signature

```java
public final class ItemTextureQuadConverter extends java.lang.Object
```

## Methods

- `public static java.util.List< UnpackedBakedQuad > convertTexture( VertexFormat format, TRSRTransformation transform, TextureAtlasSprite template, TextureAtlasSprite sprite, float z, EnumFacing facing, int color)`
- `public static java.util.List< UnpackedBakedQuad > convertTextureHorizontal( VertexFormat format, TRSRTransformation transform, TextureAtlasSprite template, TextureAtlasSprite sprite, float z, EnumFacing facing, int color)`
- `public static java.util.List< UnpackedBakedQuad > convertTextureVertical( VertexFormat format, TRSRTransformation transform, TextureAtlasSprite template, TextureAtlasSprite sprite, float z, EnumFacing facing, int color)`
- `public static UnpackedBakedQuad genQuad( VertexFormat format, TRSRTransformation transform, float x1, float y1, float x2, float y2, float z, TextureAtlasSprite sprite, EnumFacing facing, int color)`

## Description

Takes a texture and converts it into BakedQuads.
