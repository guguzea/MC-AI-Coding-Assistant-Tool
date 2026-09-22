---
title: "BakedItemModel"
description: "public class BakedItemModel extends java.lang.Object implements IBakedModel"
package: "net/minecraftforge/client/model"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/BakedItemModel.html"
sourceType: javadoc
---

# BakedItemModel

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.BakedItemModel

## Class signature

```java
public class BakedItemModel extends java.lang.Object implements IBakedModel
```

## Constructors

- `@Deprecated BakedItemModel(<any> quads, TextureAtlasSprite particle, <any> transforms, ItemOverrideList overrides)`
- `BakedItemModel(<any> quads, TextureAtlasSprite particle, <any> transforms, ItemOverrideList overrides, boolean untransformed)`

## Methods

- `ItemOverrideList getOverrides()`
- `TextureAtlasSprite getParticleTexture()`
- `java.util.List<BakedQuad> getQuads(IBlockState state, EnumFacing side, long rand)`
- `<any> handlePerspective(ItemCameraTransforms.TransformType type)`
- `boolean isAmbientOcclusion()`
- `boolean isBuiltInRenderer()`
- `boolean isGui3d()`

## Fields

- `protected IBakedModel guiModel`
- `protected ItemOverrideList overrides`
- `protected TextureAtlasSprite particle`
- `protected<any> quads`
- `protected<any> transforms`
