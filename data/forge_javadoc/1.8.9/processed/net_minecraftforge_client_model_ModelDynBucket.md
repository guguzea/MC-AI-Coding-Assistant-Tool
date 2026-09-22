# ModelDynBucket

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.ModelDynBucket

## Class signature

```java
public class ModelDynBucket extends java.lang.Object implements IModel, IModelCustomData<ModelDynBucket>, IRetexturableModel<ModelDynBucket>
```

## Constructors

- `ModelDynBucket()`
- `ModelDynBucket(ResourceLocation baseLocation, ResourceLocation liquidLocation, ResourceLocation coverLocation, Fluid fluid, boolean flipGas)`

## Methods

- `IFlexibleBakedModel bake(IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `IModelState getDefaultState()`
- `java.util.Collection<ResourceLocation> getDependencies()`
- `java.util.Collection<ResourceLocation> getTextures()`
- `IModel process(<any> customData)` — Sets the liquid in the model.
- `IModel retexture(<any> textures)` — Allows to use different textures for the model.

## Fields

- `protected ResourceLocation baseLocation`
- `protected ResourceLocation coverLocation`
- `protected boolean flipGas`
- `protected Fluid fluid`
- `protected ResourceLocation liquidLocation`
- `static ModelResourceLocation LOCATION`
- `static IModel MODEL`