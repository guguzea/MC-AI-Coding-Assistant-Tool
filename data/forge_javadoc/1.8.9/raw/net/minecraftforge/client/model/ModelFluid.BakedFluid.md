---
title: "ModelFluid.BakedFluid"
description: "public static class ModelFluid.BakedFluid extends java.lang.Object implements IFlexibleBakedModel, ISmartBlockModel, IPerspectiveAwareModel"
package: "net/minecraftforge/client/model"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/ModelFluid.BakedFluid.html"
sourceType: javadoc
---

# ModelFluid.BakedFluid

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.ModelFluid.BakedFluid

## Class signature

```java
public static class ModelFluid.BakedFluid extends java.lang.Object implements IFlexibleBakedModel, ISmartBlockModel, IPerspectiveAwareModel
```

## Constructors

- `BakedFluid(<any> transformation, <any> transforms, VertexFormat format, int color, TextureAtlasSprite still, TextureAtlasSprite flowing, boolean gas, <any> stateOption)`
- `BakedFluid(<any> transformation, <any> transforms, VertexFormat format, int color, TextureAtlasSprite still, TextureAtlasSprite flowing, boolean gas, boolean statePresent, int[] cornerRound, int flowRound)`
- `BakedFluid(<any> transformation, VertexFormat format, int color, TextureAtlasSprite still, TextureAtlasSprite flowing, boolean gas)`
- `BakedFluid(<any> transformation, VertexFormat format, int color, TextureAtlasSprite still, TextureAtlasSprite flowing, boolean gas, <any> stateOption)`

## Methods

- `java.util.List<BakedQuad> getFaceQuads(EnumFacing side)`
- `VertexFormat getFormat()`
- `java.util.List<BakedQuad> getGeneralQuads()`
- `ItemCameraTransforms getItemCameraTransforms()`
- `TextureAtlasSprite getParticleTexture()`
- `IBakedModel handleBlockState(IBlockState state)`
- `<any> handlePerspective(ItemCameraTransforms.TransformType type)`
- `boolean isAmbientOcclusion()`
- `boolean isBuiltInRenderer()`
- `boolean isGui3d()`
