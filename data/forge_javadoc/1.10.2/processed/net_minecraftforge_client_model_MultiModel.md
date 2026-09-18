# MultiModel

## Constructors

- `public MultiModel( ResourceLocation location, IModel base, IModelState baseState, com.google.common.collect.ImmutableMap<java.lang.String,org.apache.commons.lang3.tuple.Pair< IModel , IModelState >> parts)`
- `public MultiModel( ResourceLocation location, IModel base, IModelState baseState, java.util.Map<java.lang.String,org.apache.commons.lang3.tuple.Pair< IModel , IModelState >> parts)`

## Methods

- `public java.util.Collection< ResourceLocation > getDependencies()`
- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IBakedModel bake( IModelState state, VertexFormat format, com.google.common.base.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `public IModelState getDefaultState()`

## Description

Deprecated.