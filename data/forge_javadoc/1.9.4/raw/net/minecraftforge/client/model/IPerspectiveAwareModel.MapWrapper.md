---
title: "IPerspectiveAwareModel.MapWrapper"
description: "public static class IPerspectiveAwareModel.MapWrapper extends java.lang.Object implements IPerspectiveAwareModel"
package: "net/minecraftforge/client/model"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/client/model/IPerspectiveAwareModel.MapWrapper.html"
sourceType: javadoc
---

# IPerspectiveAwareModel.MapWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.IPerspectiveAwareModel.MapWrapper

## Class signature

```java
public static class IPerspectiveAwareModel.MapWrapper extends java.lang.Object implements IPerspectiveAwareModel
```

## Constructors

- `MapWrapper(IBakedModel parent, com.google.common.collect.ImmutableMap<ItemCameraTransforms.TransformType, TRSRTransformation> transforms)`
- `MapWrapper(IBakedModel parent, IModelState state)`

## Methods

- `ItemCameraTransforms getItemCameraTransforms()`
- `ItemOverrideList getOverrides()`
- `TextureAtlasSprite getParticleTexture()`
- `java.util.List<BakedQuad> getQuads(IBlockState state, EnumFacing side, long rand)`
- `static com.google.common.collect.ImmutableMap<ItemCameraTransforms.TransformType, TRSRTransformation> getTransforms(IModelState state)`
- `static com.google.common.collect.ImmutableMap<ItemCameraTransforms.TransformType, TRSRTransformation> getTransforms(ItemCameraTransforms transforms)`
- `static org.apache.commons.lang3.tuple.Pair<? extends IBakedModel, javax.vecmath.Matrix4f> handlePerspective(IBakedModel model, com.google.common.collect.ImmutableMap<ItemCameraTransforms.TransformType, TRSRTransformation> transforms, ItemCameraTransforms.TransformType cameraTransformType)`
- `static org.apache.commons.lang3.tuple.Pair<? extends IBakedModel, javax.vecmath.Matrix4f> handlePerspective(IBakedModel model, IModelState state, ItemCameraTransforms.TransformType cameraTransformType)`
- `org.apache.commons.lang3.tuple.Pair<? extends IBakedModel, javax.vecmath.Matrix4f> handlePerspective(ItemCameraTransforms.TransformType cameraTransformType)`
- `boolean isAmbientOcclusion()`
- `boolean isBuiltInRenderer()`
- `boolean isGui3d()`
