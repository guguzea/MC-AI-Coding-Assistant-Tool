---
title: "IPerspectiveAwareModel.MapWrapper"
description: "public static class IPerspectiveAwareModel.MapWrapper extends java.lang.Object implements IPerspectiveAwareModel"
package: "net/minecraftforge/client/model"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/IPerspectiveAwareModel.MapWrapper.html"
sourceType: javadoc
---

# IPerspectiveAwareModel.MapWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.IPerspectiveAwareModel.MapWrapper

## Class signature

```java
public static class IPerspectiveAwareModel.MapWrapper extends java.lang.Object implements IPerspectiveAwareModel
```

## Constructors

- `MapWrapper(IFlexibleBakedModel parent, <any> transforms)`

## Methods

- `java.util.List<BakedQuad> getFaceQuads(EnumFacing side)`
- `VertexFormat getFormat()`
- `java.util.List<BakedQuad> getGeneralQuads()`
- `ItemCameraTransforms getItemCameraTransforms()`
- `TextureAtlasSprite getParticleTexture()`
- `static<any> getTransforms(IModelState state)`
- `static<any> getTransforms(ItemCameraTransforms transforms)`
- `static<any> handlePerspective(IFlexibleBakedModel model, <any> transforms, ItemCameraTransforms.TransformType cameraTransformType)`
- `static<any> handlePerspective(IFlexibleBakedModel model, IModelState state, ItemCameraTransforms.TransformType cameraTransformType)`
- `<any> handlePerspective(ItemCameraTransforms.TransformType cameraTransformType)`
- `boolean isAmbientOcclusion()`
- `boolean isBuiltInRenderer()`
- `boolean isGui3d()`
