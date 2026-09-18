# B3DLoader.Wrapper

## Constructors

- `public Wrapper( ResourceLocation location, java.util.List< B3DModel.Texture > textures, B3DModel.Node < B3DModel.Mesh > mesh)`
- `public Wrapper( ResourceLocation location, <any> textures, B3DModel.Node < B3DModel.Mesh > mesh)`
- `public Wrapper( ResourceLocation location, <any> meshes, java.util.List< B3DModel.Texture > textures, B3DModel.Node < B3DModel.Mesh > mesh)`
- `public Wrapper( ResourceLocation location, <any> meshes, <any> textures, B3DModel.Node < B3DModel.Mesh > mesh)`

## Methods

- `public java.util.Collection< ResourceLocation > getDependencies()`
- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IFlexibleBakedModel bake( IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `public ResourceLocation getLocation()`
- `public <any> getTextureMap()`
- `public int hashCode()`
- `public boolean equals(java.lang.Object obj)`
- `public IModel retexture(<any> textures)`
- `public IModel process(<any> customData)`
- `public IModelState getDefaultState()`

## Description

Deprecated. Use ModelWrapper, this will be removed in 1.9