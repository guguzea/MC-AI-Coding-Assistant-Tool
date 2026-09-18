# AnimationItemOverrideList

## Class signature

```java
public final class AnimationItemOverrideList extends ItemOverrideList
```

## Constructors

- `public AnimationItemOverrideList( IModel model, IModelState state, VertexFormat format, java.util.function.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter, ItemOverrideList overrides)`
- `public AnimationItemOverrideList( IModel model, IModelState state, VertexFormat format, java.util.function.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter, java.util.List< ItemOverride > overrides)`

## Methods

- `public IBakedModel handleItemState( IBakedModel originalModel, ItemStack stack, World world, EntityLivingBase entity)`