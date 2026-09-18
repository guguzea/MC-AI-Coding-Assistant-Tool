---
title: "ItemLayerModel"
description: "Applies new textures to the model."
package: "net/minecraftforge/client/model"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/model/ItemLayerModel.html"
sourceType: javadoc
---

# ItemLayerModel

## Class signature

```java
public final class ItemLayerModel extends java.lang.Object implements IRetexturableModel
```

## Constructors

- `public ItemLayerModel(com.google.common.collect.ImmutableList< ResourceLocation > textures)`
- `public ItemLayerModel(com.google.common.collect.ImmutableList< ResourceLocation > textures, ItemOverrideList overrides)`
- `public ItemLayerModel( ModelBlock model)`

## Methods

- `public java.util.Collection< ResourceLocation > getDependencies()`
- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IModelState getDefaultState()`
- `public ItemLayerModel retexture(com.google.common.collect.ImmutableMap<java.lang.String,java.lang.String> textures)`
- `public IBakedModel bake( IModelState state, VertexFormat format, com.google.common.base.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `public static com.google.common.collect.ImmutableList< BakedQuad > getQuadsForSprite(int tint, TextureAtlasSprite sprite, VertexFormat format, com.google.common.base.Optional< TRSRTransformation > transform)`

## Description

Applies new textures to the model.
