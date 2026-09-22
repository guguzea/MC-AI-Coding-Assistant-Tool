---
title: "ItemLayerModel"
description: "public final class ItemLayerModel extends java.lang.Object implements IRetexturableModel"
package: "net/minecraftforge/client/model"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/client/model/ItemLayerModel.html"
sourceType: javadoc
---

# ItemLayerModel

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.ItemLayerModel

## Class signature

```java
public final class ItemLayerModel extends java.lang.Object implements IRetexturableModel
```

## Constructors

- `ItemLayerModel(com.google.common.collect.ImmutableList<ResourceLocation> textures)`
- `ItemLayerModel(com.google.common.collect.ImmutableList<ResourceLocation> textures, ItemOverrideList overrides)`
- `ItemLayerModel(ModelBlock model)`

## Methods

- `IBakedModel bake(IModelState state, VertexFormat format, com.google.common.base.Function<ResourceLocation, TextureAtlasSprite> bakedTextureGetter)`
- `IModelState getDefaultState()`
- `java.util.Collection<ResourceLocation> getDependencies()`
- `static com.google.common.collect.ImmutableList<BakedQuad> getQuadsForSprite(int tint, TextureAtlasSprite sprite, VertexFormat format, com.google.common.base.Optional<TRSRTransformation> transform)`
- `java.util.Collection<ResourceLocation> getTextures()`
- `ItemLayerModel retexture(com.google.common.collect.ImmutableMap<java.lang.String, java.lang.String> textures)` — Applies new textures to the model.

## Fields

- `static ItemLayerModel INSTANCE`
