---
title: "MultiModel"
description: "public final class MultiModel extends java.lang.Object implements IModel"
package: "net/minecraftforge/client/model"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/MultiModel.html"
sourceType: javadoc
---

# MultiModel

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.MultiModel

## Class signature

```java
public final class MultiModel extends java.lang.Object implements IModel
```

## Constructors

- `@Deprecated MultiModel(ResourceLocation location, IModel base, <any> parts)`
- `@Deprecated MultiModel(ResourceLocation location, IModel base, IModelState baseState, <any> parts)`
- `@Deprecated MultiModel(ResourceLocation location, IModel base, IModelState baseState, java.util.Map<java.lang.String, <any>> parts)`
- `@Deprecated MultiModel(ResourceLocation location, IModel base, java.util.Map<java.lang.String, <any>> parts)`

## Methods

- `@Deprecated IBakedModel bake(IModelState state, VertexFormat format, java.util.function.Function<ResourceLocation, TextureAtlasSprite> bakedTextureGetter)`
- `@Deprecated java.util.Collection<ResourceLocation> getDependencies()`
- `@Deprecated java.util.Collection<ResourceLocation> getTextures()`
