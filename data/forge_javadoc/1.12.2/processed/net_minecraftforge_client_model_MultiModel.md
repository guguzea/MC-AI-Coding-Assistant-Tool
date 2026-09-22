# MultiModel

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.MultiModel

## Class signature

```java
public final class MultiModel extends java.lang.Object implements IModel
```

## Constructors

- `@Deprecated MultiModel(ResourceLocation location, IModel base, <any> parts)`
- `@Deprecated MultiModel(ResourceLocation location, IModel base, IModelState baseState, <any> parts)`
- `@Deprecated MultiModel(ResourceLocation location, IModel base, IModelState baseState, java.util.Map<java.lang.String, <any>> parts)`
- `@Deprecated MultiModel(ResourceLocation location, IModel base, java.util.Map<java.lang.String, <any>> parts)`

## Methods

- `@Deprecated IBakedModel bake(IModelState state, VertexFormat format, java.util.function.Function<ResourceLocation, TextureAtlasSprite> bakedTextureGetter)`
- `@Deprecated java.util.Collection<ResourceLocation> getDependencies()`
- `@Deprecated java.util.Collection<ResourceLocation> getTextures()`