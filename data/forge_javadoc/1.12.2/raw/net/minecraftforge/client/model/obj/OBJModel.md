---
title: "OBJModel"
description: "Deprecated."
package: "net/minecraftforge/client/model/obj"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/obj/OBJModel.html"
sourceType: javadoc
---

# OBJModel

## Class signature

```java
public class OBJModel extends java.lang.Object implements IModel
```

## Constructors

- `public OBJModel( OBJModel.MaterialLibrary matLib, ResourceLocation modelLocation)`
- `public OBJModel( OBJModel.MaterialLibrary matLib, ResourceLocation modelLocation, net.minecraftforge.client.model.obj.OBJModel.CustomData customData)`

## Methods

- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IBakedModel bake( IModelState state, VertexFormat format, java.util.function.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `public OBJModel.MaterialLibrary getMatLib()`
- `public IModel process(<any> customData)`
- `public IModel retexture(<any> textures)`

## Description

Deprecated.
