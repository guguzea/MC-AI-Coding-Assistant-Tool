---
title: "FaceBakery"
description: "public class FaceBakery extends java.lang.Object"
package: "net/minecraft/client/renderer/block/model"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/block/model/FaceBakery.html"
sourceType: javadoc
---

# FaceBakery

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.FaceBakery

## Class signature

```java
public class FaceBakery extends java.lang.Object
```

## Constructors

- `FaceBakery()`

## Methods

- `void func_178409_a(int[] p_178409_1_, EnumFacing facing, BlockFaceUV p_178409_3_, TextureAtlasSprite p_178409_4_)`
- `static EnumFacing getFacingFromVertexData(int[] faceData)`
- `BakedQuad makeBakedQuad(Vector3f posFrom, Vector3f posTo, BlockPartFace face, TextureAtlasSprite sprite, EnumFacing facing, ITransformation modelRotationIn, BlockPartRotation partRotation, boolean uvLocked, boolean shade)`
- `BakedQuad makeBakedQuad(Vector3f posFrom, Vector3f posTo, BlockPartFace face, TextureAtlasSprite sprite, EnumFacing facing, ModelRotation modelRotationIn, BlockPartRotation partRotation, boolean uvLocked, boolean shade)`
- `int rotateVertex(Vector3f position, EnumFacing facing, int vertexIndex, ITransformation modelRotationIn, boolean uvLocked)`
- `int rotateVertex(Vector3f position, EnumFacing facing, int vertexIndex, ModelRotation modelRotationIn, boolean uvLocked)`
