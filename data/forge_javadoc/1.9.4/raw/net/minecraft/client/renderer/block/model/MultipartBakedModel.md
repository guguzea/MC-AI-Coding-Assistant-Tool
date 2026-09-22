---
title: "MultipartBakedModel"
description: "public class MultipartBakedModel extends java.lang.Object implements IBakedModel"
package: "net/minecraft/client/renderer/block/model"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/renderer/block/model/MultipartBakedModel.html"
sourceType: javadoc
---

# MultipartBakedModel

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.MultipartBakedModel

## Class signature

```java
public class MultipartBakedModel extends java.lang.Object implements IBakedModel
```

## Constructors

- `MultipartBakedModel(java.util.Map<com.google.common.base.Predicate<IBlockState>, IBakedModel> selectorsIn)`

## Methods

- `ItemCameraTransforms getItemCameraTransforms()`
- `ItemOverrideList getOverrides()`
- `TextureAtlasSprite getParticleTexture()`
- `java.util.List<BakedQuad> getQuads(IBlockState state, EnumFacing side, long rand)`
- `boolean isAmbientOcclusion()`
- `boolean isBuiltInRenderer()`
- `boolean isGui3d()`

## Fields

- `protected boolean ambientOcclusion`
- `protected ItemCameraTransforms cameraTransforms`
- `protected boolean gui3D`
- `protected ItemOverrideList overrides`
- `protected TextureAtlasSprite particleTexture`
