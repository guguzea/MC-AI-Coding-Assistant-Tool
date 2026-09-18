---
title: "FaceBakery"
description: "public class FaceBakery extends java.lang.Object"
package: "net/minecraft/client/renderer/block/model"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/renderer/block/model/FaceBakery.html"
sourceType: javadoc
---

# FaceBakery

## Class signature

```java
public class FaceBakery extends java.lang.Object
```

## Constructors

- `public FaceBakery()`

## Methods

- `public BakedQuad makeBakedQuad(org.lwjgl.util.vector.Vector3f posFrom, org.lwjgl.util.vector.Vector3f posTo, BlockPartFace face, TextureAtlasSprite sprite, EnumFacing facing, ModelRotation modelRotationIn, @Nullable BlockPartRotation partRotation, boolean uvLocked, boolean shade)`
- `public BakedQuad makeBakedQuad(org.lwjgl.util.vector.Vector3f posFrom, org.lwjgl.util.vector.Vector3f posTo, BlockPartFace face, TextureAtlasSprite sprite, EnumFacing facing, ITransformation modelRotationIn, BlockPartRotation partRotation, boolean uvLocked, boolean shade)`
- `public int rotateVertex(org.lwjgl.util.vector.Vector3f p_188011_1_, EnumFacing p_188011_2_, int p_188011_3_, ModelRotation p_188011_4_)`
- `public int rotateVertex(org.lwjgl.util.vector.Vector3f p_188011_1_, EnumFacing p_188011_2_, int p_188011_3_, ITransformation p_188011_4_)`
- `public static EnumFacing getFacingFromVertexData(int[] faceData)`
