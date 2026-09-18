---
title: "MultiLayerModel"
description: "Allows the model to process custom data from the variant definition."
package: "net/minecraftforge/client/model"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/MultiLayerModel.html"
sourceType: javadoc
---

# MultiLayerModel

## Class signature

```java
public final class MultiLayerModel extends java.lang.Object implements IModel
```

## Constructors

- `public MultiLayerModel(<any> models)`

## Methods

- `public java.util.Collection< ResourceLocation > getDependencies()`
- `public IBakedModel bake( IModelState state, VertexFormat format, java.util.function.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `public MultiLayerModel process(<any> customData)`

## Description

Allows the model to process custom data from the variant definition.
