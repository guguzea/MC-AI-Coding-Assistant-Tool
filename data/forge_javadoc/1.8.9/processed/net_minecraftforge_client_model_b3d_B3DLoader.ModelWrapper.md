# B3DLoader.ModelWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.b3d.B3DLoader.ModelWrapper

## Class signature

```java
public static class B3DLoader.ModelWrapper extends java.lang.Object implements IRetexturableModel<B3DLoader.ModelWrapper>, IModelCustomData<B3DLoader.ModelWrapper>, IModelSimpleProperties<B3DLoader.ModelWrapper>, IAnimatedModel
```

## Constructors

- `ModelWrapper(ResourceLocation modelLocation, B3DModel model, <any> meshes, boolean smooth, boolean gui3d, int defaultKey)`
- `ModelWrapper(ResourceLocation modelLocation, B3DModel model, <any> meshes, boolean smooth, boolean gui3d, int defaultKey, <any> textures)`
- `@Deprecated ModelWrapper(ResourceLocation modelLocation, B3DModel model, <any> meshes, int defaultKey)`
- `@Deprecated ModelWrapper(ResourceLocation modelLocation, B3DModel model, <any> meshes, int defaultKey, <any> textures)`

## Methods

- `IFlexibleBakedModel bake(IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `<any> getClip(java.lang.String name)`
- `IModelState getDefaultState()`
- `java.util.Collection<ResourceLocation> getDependencies()`
- `java.util.Collection<ResourceLocation> getTextures()`
- `B3DLoader.ModelWrapper gui3d(boolean value)`
- `IModel process(<any> data)` — Allows the model to process custom data from the variant definition.
- `IModel retexture(<any> textures)` — Applies new textures to the model.
- `B3DLoader.ModelWrapper smoothLighting(boolean value)`