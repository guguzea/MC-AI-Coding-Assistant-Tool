# ItemLayerModel

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.ItemLayerModel

## Class signature

```java
public class ItemLayerModel extends java.lang.Object implements IRetexturableModel<ItemLayerModel>
```

## Constructors

- `ItemLayerModel(<any> textures)`

## Methods

- `IFlexibleBakedModel bake(IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `IModelState getDefaultState()`
- `java.util.Collection<ResourceLocation> getDependencies()`
- `<any> getQuadsForSprite(int tint, TextureAtlasSprite sprite, VertexFormat format, <any> transform)`
- `java.util.Collection<ResourceLocation> getTextures()`
- `protected boolean isTransparent(int[] pixels, int uMax, int vMax, int u, int v)`
- `IModel retexture(<any> textures)` — Applies new textures to the model.

## Fields

- `static ItemLayerModel instance`