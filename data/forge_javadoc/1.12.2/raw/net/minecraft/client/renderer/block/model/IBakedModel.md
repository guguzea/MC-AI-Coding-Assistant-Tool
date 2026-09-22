---
title: "IBakedModel"
description: "public interface IBakedModel"
package: "net/minecraft/client/renderer/block/model"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/block/model/IBakedModel.html"
sourceType: javadoc
---

# IBakedModel

## Class signature

```java
public interface IBakedModel
```

## Methods

- `@Deprecated default ItemCameraTransforms getItemCameraTransforms()`
- `ItemOverrideList getOverrides()`
- `TextureAtlasSprite getParticleTexture()`
- `java.util.List<BakedQuad> getQuads(IBlockState state, EnumFacing side, long rand)`
- `default<any> handlePerspective(ItemCameraTransforms.TransformType cameraTransformType)`
- `boolean isAmbientOcclusion()`
- `default boolean isAmbientOcclusion(IBlockState state)`
- `boolean isBuiltInRenderer()`
- `boolean isGui3d()`
