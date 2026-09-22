---
title: "ModelDynBucket"
description: "public class ModelDynBucket extends java.lang.Object implements IModel, IModelCustomData<ModelDynBucket>, IRetexturableModel<ModelDynBucket>"
package: "net/minecraftforge/client/model"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/ModelDynBucket.html"
sourceType: javadoc
---

# ModelDynBucket

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.ModelDynBucket

## Class signature

```java
public class ModelDynBucket extends java.lang.Object implements IModel, IModelCustomData<ModelDynBucket>, IRetexturableModel<ModelDynBucket>
```

## Constructors

- `ModelDynBucket()`
- `ModelDynBucket(ResourceLocation baseLocation, ResourceLocation liquidLocation, ResourceLocation coverLocation, Fluid fluid, boolean flipGas)`

## Methods

- `IFlexibleBakedModel bake(IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `IModelState getDefaultState()`
- `java.util.Collection<ResourceLocation> getDependencies()`
- `java.util.Collection<ResourceLocation> getTextures()`
- `IModel process(<any> customData)` — Sets the liquid in the model.
- `IModel retexture(<any> textures)` — Allows to use different textures for the model.

## Fields

- `protected ResourceLocation baseLocation`
- `protected ResourceLocation coverLocation`
- `protected boolean flipGas`
- `protected Fluid fluid`
- `protected ResourceLocation liquidLocation`
- `static ModelResourceLocation LOCATION`
- `static IModel MODEL`
