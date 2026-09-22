---
title: "BakedModelWrapper"
description: "public abstract class BakedModelWrapper<T extends IBakedModel> extends java.lang.Object implements IBakedModel"
package: "net/minecraftforge/client/model"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/BakedModelWrapper.html"
sourceType: javadoc
---

# BakedModelWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.BakedModelWrapper<T>

## Class signature

```java
public abstract class BakedModelWrapper<T extends IBakedModel> extends java.lang.Object implements IBakedModel
```

## Constructors

- `BakedModelWrapper(T originalModel)`

## Methods

- `ItemCameraTransforms getItemCameraTransforms()`
- `ItemOverrideList getOverrides()`
- `TextureAtlasSprite getParticleTexture()`
- `java.util.List<BakedQuad> getQuads(IBlockState state, EnumFacing side, long rand)`
- `<any> handlePerspective(ItemCameraTransforms.TransformType cameraTransformType)`
- `boolean isAmbientOcclusion()`
- `boolean isAmbientOcclusion(IBlockState state)`
- `boolean isBuiltInRenderer()`
- `boolean isGui3d()`

## Fields

- `protected T originalModel`
