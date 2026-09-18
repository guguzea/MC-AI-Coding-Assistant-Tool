# ItemLayerModel

## Class signature

```java
public class ItemLayerModel extends java.lang.Object implements IRetexturableModel < ItemLayerModel >
```

## Constructors

- `public ItemLayerModel(<any> textures)`

## Methods

- `public java.util.Collection< ResourceLocation > getDependencies()`
- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IModelState getDefaultState()`
- `public IModel retexture(<any> textures)`
- `public IFlexibleBakedModel bake( IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `public <any> getQuadsForSprite(int tint, TextureAtlasSprite sprite, VertexFormat format, <any> transform)`
- `protected boolean isTransparent(int[] pixels, int uMax, int vMax, int u, int v)`

## Description

Deprecated.