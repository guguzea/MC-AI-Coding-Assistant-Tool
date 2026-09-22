---
title: "MultiModel"
description: "public final class MultiModel extends java.lang.Object implements IModel"
package: "net/minecraftforge/client/model"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/model/MultiModel.html"
sourceType: javadoc
---

# MultiModel

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.MultiModel

## Class signature

```java
public final class MultiModel extends java.lang.Object implements IModel
```

## Constructors

- `@Deprecated MultiModel(ResourceLocation location, IModel base, IModelState baseState, com.google.common.collect.ImmutableMap<java.lang.String, org.apache.commons.lang3.tuple.Pair<IModel, IModelState>> parts)`
- `@Deprecated MultiModel(ResourceLocation location, IModel base, IModelState baseState, java.util.Map<java.lang.String, org.apache.commons.lang3.tuple.Pair<IModel, IModelState>> parts)`

## Methods

- `@Deprecated IBakedModel bake(IModelState state, VertexFormat format, com.google.common.base.Function<ResourceLocation, TextureAtlasSprite> bakedTextureGetter)`
- `@Deprecated IModelState getDefaultState()`
- `@Deprecated java.util.Collection<ResourceLocation> getDependencies()`
- `@Deprecated java.util.Collection<ResourceLocation> getTextures()`
