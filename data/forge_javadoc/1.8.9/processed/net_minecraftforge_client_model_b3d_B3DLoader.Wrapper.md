# B3DLoader.Wrapper

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.b3d.B3DLoader.PartWrapper<B3DModel.Mesh> → net.minecraftforge.client.model.b3d.B3DLoader.Wrapper

## Class signature

```java
public static class B3DLoader.Wrapper extends B3DLoader.PartWrapper<B3DModel.Mesh> implements IRetexturableModel<B3DLoader.Wrapper>, IModelCustomData<B3DLoader.Wrapper>
```

## Constructors

- `@Deprecated Wrapper(ResourceLocation location, <any> meshes, <any> textures, B3DModel.Node<B3DModel.Mesh> mesh)`
- `@Deprecated Wrapper(ResourceLocation location, <any> textures, B3DModel.Node<B3DModel.Mesh> mesh)`
- `@Deprecated Wrapper(ResourceLocation location, <any> meshes, java.util.List<B3DModel.Texture> textures, B3DModel.Node<B3DModel.Mesh> mesh)`
- `@Deprecated Wrapper(ResourceLocation location, java.util.List<B3DModel.Texture> textures, B3DModel.Node<B3DModel.Mesh> mesh)`

## Methods

- `@Deprecated IFlexibleBakedModel bake(IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `@Deprecated boolean equals(java.lang.Object obj)`
- `@Deprecated IModelState getDefaultState()`
- `@Deprecated java.util.Collection<ResourceLocation> getDependencies()`
- `@Deprecated ResourceLocation getLocation()`
- `@Deprecated <any> getTextureMap()`
- `@Deprecated java.util.Collection<ResourceLocation> getTextures()`
- `@Deprecated int hashCode()`
- `@Deprecated IModel process(<any> customData)`
- `@Deprecated IModel retexture(<any> textures)`