# OBJModel

## Class signature

```java
public class OBJModel extends java.lang.Object implements IRetexturableModel , IModelCustomData
```

## Constructors

- `public OBJModel( OBJModel.MaterialLibrary matLib, ResourceLocation modelLocation)`
- `public OBJModel( OBJModel.MaterialLibrary matLib, ResourceLocation modelLocation, net.minecraftforge.client.model.obj.OBJModel.CustomData customData)`

## Methods

- `public java.util.Collection< ResourceLocation > getDependencies()`
- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IBakedModel bake( IModelState state, VertexFormat format, com.google.common.base.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `public OBJModel.MaterialLibrary getMatLib()`
- `public IModel process(com.google.common.collect.ImmutableMap<java.lang.String,java.lang.String> customData)`
- `public IModel retexture(com.google.common.collect.ImmutableMap<java.lang.String,java.lang.String> textures)`
- `public IModelState getDefaultState()`

## Description

Deprecated.