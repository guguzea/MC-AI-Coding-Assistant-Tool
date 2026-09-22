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