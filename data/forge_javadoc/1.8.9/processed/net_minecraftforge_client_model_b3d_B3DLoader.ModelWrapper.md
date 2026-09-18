# B3DLoader.ModelWrapper

## Constructors

- `public ModelWrapper( ResourceLocation modelLocation, B3DModel model, <any> meshes, boolean smooth, boolean gui3d, int defaultKey)`
- `public ModelWrapper( ResourceLocation modelLocation, B3DModel model, <any> meshes, boolean smooth, boolean gui3d, int defaultKey, <any> textures)`

## Methods

- `@Deprecated public ModelWrapper( ResourceLocation modelLocation, B3DModel model, <any> meshes, int defaultKey)`
- `@Deprecated public ModelWrapper( ResourceLocation modelLocation, B3DModel model, <any> meshes, int defaultKey, <any> textures)`
- `public java.util.Collection< ResourceLocation > getDependencies()`
- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IFlexibleBakedModel bake( IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `public IModel retexture(<any> textures)`
- `public IModel process(<any> data)`
- `public <any> getClip(java.lang.String name)`
- `public IModelState getDefaultState()`
- `public B3DLoader.ModelWrapper smoothLighting(boolean value)`
- `public B3DLoader.ModelWrapper gui3d(boolean value)`

## Description

Deprecated.