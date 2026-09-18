# MultiLayerModel

## Class signature

```java
public final class MultiLayerModel extends java.lang.Object implements IModel
```

## Constructors

- `public MultiLayerModel(<any> models)`

## Methods

- `public java.util.Collection< ResourceLocation > getDependencies()`
- `public IBakedModel bake( IModelState state, VertexFormat format, java.util.function.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `public MultiLayerModel process(<any> customData)`

## Description

Allows the model to process custom data from the variant definition.