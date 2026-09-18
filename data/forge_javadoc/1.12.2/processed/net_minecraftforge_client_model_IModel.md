# IModel

## Class signature

```java
public interface IModel
```

## Methods

- `default java.util.Collection< ResourceLocation > getDependencies()`
- `default java.util.Collection< ResourceLocation > getTextures()`
- `IBakedModel bake( IModelState state, VertexFormat format, java.util.function.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `default IModelState getDefaultState()`
- `default java.util.Optional<? extends IClip > getClip(java.lang.String name)`
- `default IModel process(<any> customData)`
- `default IModel smoothLighting(boolean value)`
- `default IModel gui3d(boolean value)`
- `default IModel uvlock(boolean value)`
- `default IModel retexture(<any> textures)`
- `default java.util.Optional< ModelBlock > asVanillaModel()`

## Description

Allows the model to process custom data from the variant definition.