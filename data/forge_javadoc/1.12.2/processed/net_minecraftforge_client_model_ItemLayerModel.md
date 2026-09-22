# ItemLayerModel

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.ItemLayerModel

## Class signature

```java
public final class ItemLayerModel extends java.lang.Object implements IModel
```

## Constructors

- `ItemLayerModel(<any> textures)`
- `ItemLayerModel(<any> textures, ItemOverrideList overrides)`

## Methods

- `IBakedModel bake(IModelState state, VertexFormat format, java.util.function.Function<ResourceLocation, TextureAtlasSprite> bakedTextureGetter)`
- `static<any> getQuadsForSprite(int tint, TextureAtlasSprite sprite, VertexFormat format, java.util.Optional<TRSRTransformation> transform)`
- `java.util.Collection<ResourceLocation> getTextures()`
- `ItemLayerModel retexture(<any> textures)` — Applies new textures to the model.

## Fields

- `static ItemLayerModel INSTANCE`