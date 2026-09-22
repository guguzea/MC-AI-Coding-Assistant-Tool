---
title: "MultiModel.Baked"
description: "public static class MultiModel.Baked extends java.lang.Object implements IFlexibleBakedModel, IPerspectiveAwareModel"
package: "net/minecraftforge/client/model"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/MultiModel.Baked.html"
sourceType: javadoc
---

# MultiModel.Baked

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.MultiModel.Baked

## Class signature

```java
public static class MultiModel.Baked extends java.lang.Object implements IFlexibleBakedModel, IPerspectiveAwareModel
```

## Constructors

- `Baked(IFlexibleBakedModel base, <any> parts)`
- `Baked(ResourceLocation location, boolean perspective, IFlexibleBakedModel base, <any> parts)`

## Methods

- `IFlexibleBakedModel getBaseModel()`
- `java.util.List<BakedQuad> getFaceQuads(EnumFacing side)`
- `VertexFormat getFormat()`
- `java.util.List<BakedQuad> getGeneralQuads()`
- `ItemCameraTransforms getItemCameraTransforms()`
- `TextureAtlasSprite getParticleTexture()`
- `java.util.Map<java.lang.String, IFlexibleBakedModel> getParts()`
- `<any> handlePerspective(ItemCameraTransforms.TransformType cameraTransformType)`
- `boolean isAmbientOcclusion()`
- `boolean isBuiltInRenderer()`
- `boolean isGui3d()`

## Fields

- `protected IFlexibleBakedModel base`
- `protected<any> faces`
- `protected<any> general`
- `protected IFlexibleBakedModel internalBase`
- `protected<any> parts`
- `protected<any> transforms`
