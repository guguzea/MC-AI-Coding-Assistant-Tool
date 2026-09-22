---
title: "PerspectiveMapWrapper"
description: "public class PerspectiveMapWrapper extends java.lang.Object implements IBakedModel"
package: "net/minecraftforge/client/model"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/PerspectiveMapWrapper.html"
sourceType: javadoc
---

# PerspectiveMapWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.PerspectiveMapWrapper

## Class signature

```java
public class PerspectiveMapWrapper extends java.lang.Object implements IBakedModel
```

## Constructors

- `PerspectiveMapWrapper(IBakedModel parent, <any> transforms)`

## Methods

- `ItemCameraTransforms getItemCameraTransforms()`
- `ItemOverrideList getOverrides()`
- `TextureAtlasSprite getParticleTexture()`
- `java.util.List<BakedQuad> getQuads(IBlockState state, EnumFacing side, long rand)`
- `static<any> getTransforms(IModelState state)`
- `static<any> getTransforms(ItemCameraTransforms transforms)`
- `static<any> handlePerspective(IBakedModel model, <any> transforms, ItemCameraTransforms.TransformType cameraTransformType)`
- `static<any> handlePerspective(IBakedModel model, IModelState state, ItemCameraTransforms.TransformType cameraTransformType)`
- `<any> handlePerspective(ItemCameraTransforms.TransformType cameraTransformType)`
- `boolean isAmbientOcclusion()`
- `boolean isAmbientOcclusion(IBlockState state)`
- `boolean isBuiltInRenderer()`
- `boolean isGui3d()`
