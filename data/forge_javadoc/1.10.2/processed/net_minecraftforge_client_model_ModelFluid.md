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