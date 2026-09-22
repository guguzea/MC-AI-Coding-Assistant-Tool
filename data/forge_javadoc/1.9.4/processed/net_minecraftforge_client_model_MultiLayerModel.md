# MultiLayerModel

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.MultiLayerModel

## Class signature

```java
public final class MultiLayerModel extends java.lang.Object implements IModelCustomData
```

## Constructors

- `MultiLayerModel(com.google.common.collect.ImmutableMap<com.google.common.base.Optional<BlockRenderLayer>, ModelResourceLocation> models)`

## Methods

- `IBakedModel bake(IModelState state, VertexFormat format, com.google.common.base.Function<ResourceLocation, TextureAtlasSprite> bakedTextureGetter)`
- `IModelState getDefaultState()`
- `java.util.Collection<ResourceLocation> getDependencies()`
- `java.util.Collection<ResourceLocation> getTextures()`
- `MultiLayerModel process(com.google.common.collect.ImmutableMap<java.lang.String, java.lang.String> customData)` — Allows the model to process custom data from the variant definition.

## Fields

- `static MultiLayerModel INSTANCE`