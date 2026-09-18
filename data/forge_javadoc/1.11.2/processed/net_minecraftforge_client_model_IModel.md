# IModel

## Class signature

```java
public interface IModel
```

## Methods

- `java.util.Collection< ResourceLocation > getDependencies()`
- `java.util.Collection< ResourceLocation > getTextures()`
- `IBakedModel bake( IModelState state, VertexFormat format, com.google.common.base.Function< ResourceLocation , TextureAtlasSprite > bakedTextureGetter)`
- `IModelState getDefaultState()`