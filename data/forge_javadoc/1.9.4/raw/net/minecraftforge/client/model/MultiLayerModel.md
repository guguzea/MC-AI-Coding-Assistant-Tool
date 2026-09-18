---
title: "MultiLayerModel"
description: "Allows the model to process custom data from the variant definition."
package: "net/minecraftforge/client/model"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/client/model/MultiLayerModel.html"
sourceType: javadoc
---

# MultiLayerModel

## Class signature

```java
public final class MultiLayerModel extends java.lang.Object implements IModelCustomData
```

## Constructors

- `public MultiLayerModel(com.google.common.collect.ImmutableMap<com.google.common.base.Optional< BlockRenderLayer >, ModelResourceLocation > models)`

## Methods

- `public java.util.Collection< ResourceLocation > getDependencies()`
- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IBakedModel bake( IModelState state, VertexFormat format, com.google.common.base.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `public IModelState getDefaultState()`
- `public MultiLayerModel process(com.google.common.collect.ImmutableMap<java.lang.String,java.lang.String> customData)`

## Description

Allows the model to process custom data from the variant definition.
