# MultiLayerModel

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.MultiLayerModel

## Class signature

```java
public class MultiLayerModel extends java.lang.Object implements IModelCustomData<MultiLayerModel>
```

## Constructors

- `MultiLayerModel(<any> models)`

## Methods

- `IFlexibleBakedModel bake(IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `IModelState getDefaultState()`
- `java.util.Collection<ResourceLocation> getDependencies()`
- `java.util.Collection<ResourceLocation> getTextures()`
- `IModel process(<any> customData)` — Allows the model to process custom data from the variant definition.

## Fields

- `static MultiLayerModel instance`