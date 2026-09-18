---
title: "SimpleBakedModel"
description: "public class SimpleBakedModel extends java.lang.Object implements IBakedModel"
package: "net/minecraft/client/renderer/block/model"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/renderer/block/model/SimpleBakedModel.html"
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

- `public java.util.List< BakedQuad > getQuads(@Nullable IBlockState state, @Nullable EnumFacing side, long rand)`
- `public boolean isAmbientOcclusion()`
- `public boolean isGui3d()`
- `public boolean isBuiltInRenderer()`
- `public TextureAtlasSprite getParticleTexture()`
- `public ItemCameraTransforms getItemCameraTransforms()`
- `public ItemOverrideList getOverrides()`
