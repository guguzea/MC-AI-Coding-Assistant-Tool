---
title: "OBJModel"
description: "public class OBJModel extends java.lang.Object implements IModel"
package: "net/minecraftforge/client/model/obj"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/obj/OBJModel.html"
sourceType: javadoc
---

# OBJModel

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.obj.OBJModel

## Class signature

```java
public class OBJModel extends java.lang.Object implements IModel
```

## Constructors

- `OBJModel(OBJModel.MaterialLibrary matLib, ResourceLocation modelLocation)`
- `OBJModel(OBJModel.MaterialLibrary matLib, ResourceLocation modelLocation, net.minecraftforge.client.model.obj.OBJModel.CustomData customData)`

## Methods

- `IBakedModel bake(IModelState state, VertexFormat format, java.util.function.Function<ResourceLocation, TextureAtlasSprite> bakedTextureGetter)`
- `OBJModel.MaterialLibrary getMatLib()`
- `java.util.Collection<ResourceLocation> getTextures()`
- `IModel process(<any> customData)` — Allows the model to process custom data from the variant definition.
- `IModel retexture(<any> textures)` — Applies new textures to the model.
