# MultiLayerModel

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.MultiLayerModel

## Class signature

```java
public final class MultiLayerModel extends java.lang.Object implements IModel
```

## Constructors

- `MultiLayerModel(<any> models)`

## Methods

- `IBakedModel bake(IModelState state, VertexFormat format, java.util.function.Function<ResourceLocation, TextureAtlasSprite> bakedTextureGetter)`
- `java.util.Collection<ResourceLocation> getDependencies()`
- `MultiLayerModel process(<any> customData)` — Allows the model to process custom data from the variant definition.

## Fields

- `static MultiLayerModel INSTANCE`