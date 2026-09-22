# ModelDynBucket

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.ModelDynBucket

## Class signature

```java
public final class ModelDynBucket extends java.lang.Object implements IModel
```

## Constructors

- `ModelDynBucket()`
- `@Deprecated ModelDynBucket(ResourceLocation baseLocation, ResourceLocation liquidLocation, ResourceLocation coverLocation, Fluid fluid, boolean flipGas)`
- `ModelDynBucket(ResourceLocation baseLocation, ResourceLocation liquidLocation, ResourceLocation coverLocation, Fluid fluid, boolean flipGas, boolean tint)`

## Methods

- `IBakedModel bake(IModelState state, VertexFormat format, java.util.function.Function<ResourceLocation, TextureAtlasSprite> bakedTextureGetter)`
- `java.util.Collection<ResourceLocation> getTextures()`
- `ModelDynBucket process(<any> customData)` — Sets the fluid in the model.
- `ModelDynBucket retexture(<any> textures)` — Allows to use different textures for the model.

## Fields

- `static ModelResourceLocation LOCATION`
- `static IModel MODEL`