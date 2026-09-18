# ModelDynBucket

## Class signature

```java
public final class ModelDynBucket extends java.lang.Object implements IModel , IModelCustomData , IRetexturableModel
```

## Constructors

- `public ModelDynBucket()`
- `public ModelDynBucket(@Nullable ResourceLocation baseLocation, @Nullable ResourceLocation liquidLocation, @Nullable ResourceLocation coverLocation, @Nullable Fluid fluid, boolean flipGas)`

## Methods

- `public java.util.Collection< ResourceLocation > getDependencies()`
- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IBakedModel bake( IModelState state, VertexFormat format, com.google.common.base.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `public IModelState getDefaultState()`
- `public ModelDynBucket process(com.google.common.collect.ImmutableMap<java.lang.String,java.lang.String> customData)`
- `public ModelDynBucket retexture(com.google.common.collect.ImmutableMap<java.lang.String,java.lang.String> textures)`

## Description

Sets the liquid in the model.