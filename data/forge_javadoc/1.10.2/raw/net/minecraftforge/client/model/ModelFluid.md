---
title: "ModelFluid"
description: "public final class ModelFluid extends java.lang.Object implements IModelCustomData"
package: "net/minecraftforge/client/model"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/model/ModelFluid.html"
sourceType: javadoc
---

# ModelFluid

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.ModelFluid

## Class signature

```java
public final class ModelFluid extends java.lang.Object implements IModelCustomData
```

## Constructors

- `ModelFluid(Fluid fluid)`

## Methods

- `IBakedModel bake(IModelState state, VertexFormat format, com.google.common.base.Function<ResourceLocation, TextureAtlasSprite> bakedTextureGetter)`
- `IModelState getDefaultState()`
- `java.util.Collection<ResourceLocation> getDependencies()`
- `java.util.Collection<ResourceLocation> getTextures()`
- `ModelFluid process(com.google.common.collect.ImmutableMap<java.lang.String, java.lang.String> customData)` — Allows the model to process custom data from the variant definition.

## Fields

- `static ModelFluid LAVA`
- `static ModelFluid WATER`
