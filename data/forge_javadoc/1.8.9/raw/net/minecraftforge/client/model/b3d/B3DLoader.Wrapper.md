---
title: "B3DLoader.Wrapper"
description: "Deprecated. Use ModelWrapper, this will be removed in 1.9"
package: "net/minecraftforge/client/model/b3d"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/b3d/B3DLoader.Wrapper.html"
sourceType: javadoc
---

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
