---
title: "ModelFluid"
description: "Allows the model to process custom data from the variant definition."
package: "net/minecraftforge/client/model"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/ModelFluid.html"
sourceType: javadoc
---

# ModelFluid

## Class signature

```java
public class ModelFluid extends java.lang.Object implements IModelCustomData < ModelFluid >
```

## Constructors

- `public ModelFluid( Fluid fluid)`

## Methods

- `public java.util.Collection< ResourceLocation > getDependencies()`
- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IFlexibleBakedModel bake( IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `public IModelState getDefaultState()`
- `public IModel process(<any> customData)`

## Description

Allows the model to process custom data from the variant definition.
