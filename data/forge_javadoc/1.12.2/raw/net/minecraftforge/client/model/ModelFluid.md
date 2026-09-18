---
title: "ModelFluid"
description: "Allows the model to process custom data from the variant definition."
package: "net/minecraftforge/client/model"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/ModelFluid.html"
sourceType: javadoc
---

# ModelFluid

## Class signature

```java
public final class ModelFluid extends java.lang.Object implements IModel
```

## Constructors

- `public ModelFluid( Fluid fluid)`

## Methods

- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IBakedModel bake( IModelState state, VertexFormat format, java.util.function.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `public ModelFluid process(<any> customData)`

## Description

Allows the model to process custom data from the variant definition.
