# ModelDynBucket

## Class signature

```java
public final class ModelDynBucket extends java.lang.Object implements IModel
```

## Constructors

- `public ModelDynBucket()`
- `public ModelDynBucket( ResourceLocation baseLocation, ResourceLocation liquidLocation, ResourceLocation coverLocation, Fluid fluid, boolean flipGas, boolean tint)`

## Methods

- `@Deprecated public ModelDynBucket( ResourceLocation baseLocation, ResourceLocation liquidLocation, ResourceLocation coverLocation, Fluid fluid, boolean flipGas)`
- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IBakedModel bake( IModelState state, VertexFormat format, java.util.function.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `public ModelDynBucket process(<any> customData)`
- `public ModelDynBucket retexture(<any> textures)`

## Description

Deprecated. use ModelDynBucket(ResourceLocation, ResourceLocation, ResourceLocation, Fluid, boolean, boolean)