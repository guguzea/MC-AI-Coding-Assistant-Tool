# ModelManager

## Class signature

```java
public class ModelManager extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `public ModelManager( TextureMap textures)`

## Methods

- `public void onResourceManagerReload( IResourceManager resourceManager)`
- `public IBakedModel getModel( ModelResourceLocation modelLocation)`
- `public IBakedModel getMissingModel()`
- `public TextureMap getTextureMap()`
- `public BlockModelShapes getBlockModelShapes()`