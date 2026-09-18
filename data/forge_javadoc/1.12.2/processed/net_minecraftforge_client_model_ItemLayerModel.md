# ItemLayerModel

## Class signature

```java
public final class ItemLayerModel extends java.lang.Object implements IModel
```

## Constructors

- `public ItemLayerModel(<any> textures)`
- `public ItemLayerModel(<any> textures, ItemOverrideList overrides)`

## Methods

- `public java.util.Collection< ResourceLocation > getTextures()`
- `public ItemLayerModel retexture(<any> textures)`
- `public IBakedModel bake( IModelState state, VertexFormat format, java.util.function.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `public static <any> getQuadsForSprite(int tint, TextureAtlasSprite sprite, VertexFormat format, java.util.Optional< TRSRTransformation > transform)`

## Description

Applies new textures to the model.