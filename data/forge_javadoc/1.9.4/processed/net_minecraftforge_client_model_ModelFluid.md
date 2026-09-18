# ModelFluid

## Class signature

```java
public final class ModelFluid extends java.lang.Object implements IModelCustomData
```

## Constructors

- `public ModelFluid( Fluid fluid)`

## Methods

- `public java.util.Collection< ResourceLocation > getDependencies()`
- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IBakedModel bake( IModelState state, VertexFormat format, com.google.common.base.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `public IModelState getDefaultState()`
- `public ModelFluid process(com.google.common.collect.ImmutableMap<java.lang.String,java.lang.String> customData)`

## Description

Allows the model to process custom data from the variant definition.