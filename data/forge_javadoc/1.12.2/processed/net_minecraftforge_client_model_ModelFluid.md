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