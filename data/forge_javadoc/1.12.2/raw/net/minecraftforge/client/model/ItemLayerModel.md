---
title: "ItemLayerModel"
description: "Applies new textures to the model."
package: "net/minecraftforge/client/model"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/ItemLayerModel.html"
sourceType: javadoc
---

# ItemLayerModel

## Class signature

```java
public final class ItemLayerModel extends java.lang.Object implements IModel
```

## Constructors

- `public ItemLayerModel(<any> textures)`
- `public ItemLayerModel(<any> textures, ItemOverrideList overrides)`

## Methods

- `public java.util.Collection< ResourceLocation > getTextures()`
- `public ItemLayerModel retexture(<any> textures)`
- `public IBakedModel bake( IModelState state, VertexFormat format, java.util.function.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `public static <any> getQuadsForSprite(int tint, TextureAtlasSprite sprite, VertexFormat format, java.util.Optional< TRSRTransformation > transform)`

## Description

Applies new textures to the model.
