# MultiModel

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.MultiModel

## Class signature

```java
public final class MultiModel extends java.lang.Object implements IModel
```

## Constructors

- `@Deprecated MultiModel(ResourceLocation location, IModel base, IModelState baseState, com.google.common.collect.ImmutableMap<java.lang.String, org.apache.commons.lang3.tuple.Pair<IModel, IModelState>> parts)`
- `@Deprecated MultiModel(ResourceLocation location, IModel base, IModelState baseState, java.util.Map<java.lang.String, org.apache.commons.lang3.tuple.Pair<IModel, IModelState>> parts)`

## Methods

- `@Deprecated IBakedModel bake(IModelState state, VertexFormat format, com.google.common.base.Function<ResourceLocation, TextureAtlasSprite> bakedTextureGetter)`
- `@Deprecated IModelState getDefaultState()`
- `@Deprecated java.util.Collection<ResourceLocation> getDependencies()`
- `@Deprecated java.util.Collection<ResourceLocation> getTextures()`