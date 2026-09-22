---
title: "ModelFluid"
description: "public final class ModelFluid extends java.lang.Object implements IModel"
package: "net/minecraftforge/client/model"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/ModelFluid.html"
sourceType: javadoc
---

# ModelFluid

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.ModelFluid

## Class signature

```java
public final class ModelFluid extends java.lang.Object implements IModel
```

## Constructors

- `ModelFluid(Fluid fluid)`

## Methods

- `IBakedModel bake(IModelState state, VertexFormat format, java.util.function.Function<ResourceLocation, TextureAtlasSprite> bakedTextureGetter)`
- `java.util.Collection<ResourceLocation> getTextures()`
- `ModelFluid process(<any> customData)` — Allows the model to process custom data from the variant definition.

## Fields

- `static ModelFluid LAVA`
- `static ModelFluid WATER`
