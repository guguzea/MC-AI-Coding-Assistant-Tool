# ModelDynBucket

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.ModelDynBucket

## Class signature

```java
public final class ModelDynBucket extends java.lang.Object implements IModel, IModelCustomData, IRetexturableModel
```

## Constructors

- `ModelDynBucket()`
- `ModelDynBucket(ResourceLocation baseLocation, ResourceLocation liquidLocation, ResourceLocation coverLocation, Fluid fluid, boolean flipGas)`

## Methods

- `IBakedModel bake(IModelState state, VertexFormat format, com.google.common.base.Function<ResourceLocation, TextureAtlasSprite> bakedTextureGetter)`
- `IModelState getDefaultState()`
- `java.util.Collection<ResourceLocation> getDependencies()`
- `java.util.Collection<ResourceLocation> getTextures()`
- `ModelDynBucket process(com.google.common.collect.ImmutableMap<java.lang.String, java.lang.String> customData)` — Sets the liquid in the model.
- `ModelDynBucket retexture(com.google.common.collect.ImmutableMap<java.lang.String, java.lang.String> textures)` — Allows to use different textures for the model.

## Fields

- `static ModelResourceLocation LOCATION`
- `static IModel MODEL`