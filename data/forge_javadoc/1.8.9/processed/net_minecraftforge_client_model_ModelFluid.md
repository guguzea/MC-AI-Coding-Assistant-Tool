# ModelFluid

## Class signature

```java
public class ModelFluid extends java.lang.Object implements IModelCustomData < ModelFluid >
```

## Constructors

- `public ModelFluid( Fluid fluid)`

## Methods

- `public java.util.Collection< ResourceLocation > getDependencies()`
- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IFlexibleBakedModel bake( IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `public IModelState getDefaultState()`
- `public IModel process(<any> customData)`

## Description

Allows the model to process custom data from the variant definition.