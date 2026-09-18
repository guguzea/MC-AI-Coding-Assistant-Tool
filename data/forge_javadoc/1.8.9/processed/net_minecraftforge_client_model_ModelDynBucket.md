# ModelDynBucket

## Class signature

```java
public class ModelDynBucket extends java.lang.Object implements IModel , IModelCustomData < ModelDynBucket >, IRetexturableModel < ModelDynBucket >
```

## Constructors

- `public ModelDynBucket()`
- `public ModelDynBucket( ResourceLocation baseLocation, ResourceLocation liquidLocation, ResourceLocation coverLocation, Fluid fluid, boolean flipGas)`

## Methods

- `public java.util.Collection< ResourceLocation > getDependencies()`
- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IFlexibleBakedModel bake( IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `public IModelState getDefaultState()`
- `public IModel process(<any> customData)`
- `public IModel retexture(<any> textures)`

## Description

Sets the liquid in the model.