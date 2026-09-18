# MultiLayerModel

## Class signature

```java
public final class MultiLayerModel extends java.lang.Object implements IModelCustomData
```

## Constructors

- `public MultiLayerModel(com.google.common.collect.ImmutableMap<com.google.common.base.Optional< BlockRenderLayer >, ModelResourceLocation > models)`

## Methods

- `public java.util.Collection< ResourceLocation > getDependencies()`
- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IBakedModel bake( IModelState state, VertexFormat format, com.google.common.base.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `public IModelState getDefaultState()`
- `public MultiLayerModel process(com.google.common.collect.ImmutableMap<java.lang.String,java.lang.String> customData)`

## Description

Allows the model to process custom data from the variant definition.