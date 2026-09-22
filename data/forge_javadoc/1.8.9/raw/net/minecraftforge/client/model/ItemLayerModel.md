---
title: "ItemLayerModel"
description: "public class ItemLayerModel extends java.lang.Object implements IRetexturableModel<ItemLayerModel>"
package: "net/minecraftforge/client/model"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/ItemLayerModel.html"
sourceType: javadoc
---

# ItemLayerModel

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.ItemLayerModel

## Class signature

```java
public class ItemLayerModel extends java.lang.Object implements IRetexturableModel<ItemLayerModel>
```

## Constructors

- `ItemLayerModel(<any> textures)`

## Methods

- `IFlexibleBakedModel bake(IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `IModelState getDefaultState()`
- `java.util.Collection<ResourceLocation> getDependencies()`
- `<any> getQuadsForSprite(int tint, TextureAtlasSprite sprite, VertexFormat format, <any> transform)`
- `java.util.Collection<ResourceLocation> getTextures()`
- `protected boolean isTransparent(int[] pixels, int uMax, int vMax, int u, int v)`
- `IModel retexture(<any> textures)` — Applies new textures to the model.

## Fields

- `static ItemLayerModel instance`
