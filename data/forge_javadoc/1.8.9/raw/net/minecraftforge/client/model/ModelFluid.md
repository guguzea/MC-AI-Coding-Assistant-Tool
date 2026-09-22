---
title: "ModelFluid"
description: "public class ModelFluid extends java.lang.Object implements IModelCustomData<ModelFluid>"
package: "net/minecraftforge/client/model"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/ModelFluid.html"
sourceType: javadoc
---

# ModelFluid

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.ModelFluid

## Class signature

```java
public class ModelFluid extends java.lang.Object implements IModelCustomData<ModelFluid>
```

## Constructors

- `ModelFluid(Fluid fluid)`

## Methods

- `IFlexibleBakedModel bake(IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `IModelState getDefaultState()`
- `java.util.Collection<ResourceLocation> getDependencies()`
- `java.util.Collection<ResourceLocation> getTextures()`
- `IModel process(<any> customData)` — Allows the model to process custom data from the variant definition.

## Fields

- `static ModelFluid lavaModel`
- `static ModelFluid waterModel`
