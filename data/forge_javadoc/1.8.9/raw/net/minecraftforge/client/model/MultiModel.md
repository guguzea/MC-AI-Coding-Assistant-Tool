---
title: "MultiModel"
description: "public class MultiModel extends java.lang.Object implements IModel"
package: "net/minecraftforge/client/model"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/MultiModel.html"
sourceType: javadoc
---

# MultiModel

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.MultiModel

## Class signature

```java
public class MultiModel extends java.lang.Object implements IModel
```

## Constructors

- `MultiModel(IModel base, IModelState baseState, <any> parts)`
- `MultiModel(IModel base, IModelState baseState, java.util.Map<java.lang.String, <any>> parts)`
- `MultiModel(ResourceLocation location, IModel base, IModelState baseState, <any> parts)`
- `MultiModel(ResourceLocation location, IModel base, IModelState baseState, java.util.Map<java.lang.String, <any>> parts)`

## Methods

- `IFlexibleBakedModel bake(IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `IModel getBaseModel()`
- `IModelState getDefaultState()`
- `java.util.Collection<ResourceLocation> getDependencies()`
- `java.util.Map<java.lang.String, <any>> getParts()`
- `java.util.Collection<ResourceLocation> getTextures()`

## Fields

- `protected IModel base`
- `protected IModelState baseState`
- `protected ResourceLocation location`
- `protected java.util.Map<java.lang.String, <any>> parts`
