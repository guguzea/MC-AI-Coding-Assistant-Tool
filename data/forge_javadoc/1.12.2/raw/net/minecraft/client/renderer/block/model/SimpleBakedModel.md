---
title: "SimpleBakedModel"
description: "public class SimpleBakedModel extends java.lang.Object implements IBakedModel"
package: "net/minecraft/client/renderer/block/model"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/block/model/SimpleBakedModel.html"
sourceType: javadoc
---

# SimpleBakedModel

## Class signature

```java
public class SimpleBakedModel extends java.lang.Object implements IBakedModel
```

## Constructors

- `public SimpleBakedModel(java.util.List< BakedQuad > generalQuadsIn, java.util.Map< EnumFacing ,java.util.List< BakedQuad >> faceQuadsIn, boolean ambientOcclusionIn, boolean gui3dIn, TextureAtlasSprite textureIn, ItemCameraTransforms cameraTransformsIn, ItemOverrideList itemOverrideListIn)`

## Methods

- `public java.util.List< BakedQuad > getQuads( IBlockState state, EnumFacing side, long rand)`
- `public boolean isAmbientOcclusion()`
- `public boolean isGui3d()`
- `public boolean isBuiltInRenderer()`
- `public TextureAtlasSprite getParticleTexture()`
- `public ItemCameraTransforms getItemCameraTransforms()`
- `public ItemOverrideList getOverrides()`
