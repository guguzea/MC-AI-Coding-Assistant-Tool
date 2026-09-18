---
title: "OBJModel"
description: "Allows the model to process custom data from the variant definition."
package: "net/minecraftforge/client/model/obj"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/obj/OBJModel.html"
sourceType: javadoc
---

# OBJModel

## Class signature

```java
public class OBJModel extends java.lang.Object implements IRetexturableModel < OBJModel >, IModelCustomData < OBJModel >
```

## Constructors

- `public OBJModel( OBJModel.MaterialLibrary matLib, ResourceLocation modelLocation)`
- `public OBJModel( OBJModel.MaterialLibrary matLib, ResourceLocation modelLocation, net.minecraftforge.client.model.obj.OBJModel.CustomData customData)`

## Methods

- `public java.util.Collection< ResourceLocation > getDependencies()`
- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IFlexibleBakedModel bake( IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `public OBJModel.MaterialLibrary getMatLib()`
- `public IModel process(<any> customData)`
- `public IModel retexture(<any> textures)`
- `public IModelState getDefaultState()`

## Description

Allows the model to process custom data from the variant definition.
