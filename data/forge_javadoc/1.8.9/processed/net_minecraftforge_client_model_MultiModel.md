# MultiModel

## Class signature

```java
public class MultiModel extends java.lang.Object implements IModel
```

## Constructors

- `public MultiModel( ResourceLocation location, IModel base, IModelState baseState, <any> parts)`
- `public MultiModel( IModel base, IModelState baseState, <any> parts)`
- `public MultiModel( IModel base, IModelState baseState, java.util.Map<java.lang.String,<any>> parts)`
- `public MultiModel( ResourceLocation location, IModel base, IModelState baseState, java.util.Map<java.lang.String,<any>> parts)`

## Methods

- `public java.util.Collection< ResourceLocation > getDependencies()`
- `public java.util.Collection< ResourceLocation > getTextures()`
- `public IFlexibleBakedModel bake( IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `public IModel getBaseModel()`
- `public java.util.Map<java.lang.String,<any>> getParts()`
- `public IModelState getDefaultState()`