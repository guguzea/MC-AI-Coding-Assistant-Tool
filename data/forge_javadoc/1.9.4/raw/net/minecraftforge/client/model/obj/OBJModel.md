---
title: "OBJModel"
description: "public class OBJModel extends java.lang.Object implements IRetexturableModel, IModelCustomData"
package: "net/minecraftforge/client/model/obj"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/client/model/obj/OBJModel.html"
sourceType: javadoc
---

# OBJModel

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.obj.OBJModel

## Class signature

```java
public class OBJModel extends java.lang.Object implements IRetexturableModel, IModelCustomData
```

## Constructors

- `OBJModel(OBJModel.MaterialLibrary matLib, ResourceLocation modelLocation)`
- `OBJModel(OBJModel.MaterialLibrary matLib, ResourceLocation modelLocation, net.minecraftforge.client.model.obj.OBJModel.CustomData customData)`

## Methods

- `IBakedModel bake(IModelState state, VertexFormat format, com.google.common.base.Function<ResourceLocation, TextureAtlasSprite> bakedTextureGetter)`
- `IModelState getDefaultState()`
- `java.util.Collection<ResourceLocation> getDependencies()`
- `OBJModel.MaterialLibrary getMatLib()`
- `java.util.Collection<ResourceLocation> getTextures()`
- `IModel process(com.google.common.collect.ImmutableMap<java.lang.String, java.lang.String> customData)` — Allows the model to process custom data from the variant definition.
- `IModel retexture(com.google.common.collect.ImmutableMap<java.lang.String, java.lang.String> textures)` — Applies new textures to the model.
