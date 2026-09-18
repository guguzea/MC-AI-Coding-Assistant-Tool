---
title: "BakedItemModel"
description: "Deprecated. use #BakedItemModel(ImmutableList, TextureAtlasSprite, ImmutableMap, ItemOverrideList, boolean)"
package: "net/minecraftforge/client/model"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/BakedItemModel.html"
sourceType: javadoc
---

# BakedItemModel

## Class signature

```java
public class BakedItemModel extends java.lang.Object implements IBakedModel
```

## Constructors

- `public BakedItemModel(<any> quads, TextureAtlasSprite particle, <any> transforms, ItemOverrideList overrides, boolean untransformed)`

## Methods

- `@Deprecated public BakedItemModel(<any> quads, TextureAtlasSprite particle, <any> transforms, ItemOverrideList overrides)`
- `public boolean isAmbientOcclusion()`
- `public boolean isGui3d()`
- `public boolean isBuiltInRenderer()`
- `public TextureAtlasSprite getParticleTexture()`
- `public ItemOverrideList getOverrides()`
- `public java.util.List< BakedQuad > getQuads( IBlockState state, EnumFacing side, long rand)`
- `public <any> handlePerspective( ItemCameraTransforms.TransformType type)`

## Description

Deprecated. use #BakedItemModel(ImmutableList, TextureAtlasSprite, ImmutableMap, ItemOverrideList, boolean)
