# ModelFluid

## Class signature

```java
public final class ModelFluid extends java.lang.Object implements IModel
```

## Constructors

- `public ModelFluid( Fluid fluid)`

## Methods

- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IBakedModel bake( IModelState state, VertexFormat format, java.util.function.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `public ModelFluid process(<any> customData)`

## Description

Allows the model to process custom data from the variant definition.