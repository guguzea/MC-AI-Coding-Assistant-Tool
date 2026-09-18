# BakedModelWrapper

## Class signature

```java
public abstract class BakedModelWrapper<T extends IBakedModel > extends java.lang.Object implements IBakedModel
```

## Constructors

- `public BakedModelWrapper( T originalModel)`

## Methods

- `public java.util.List< BakedQuad > getQuads( IBlockState state, EnumFacing side, long rand)`
- `public boolean isAmbientOcclusion()`
- `public boolean isAmbientOcclusion( IBlockState state)`
- `public boolean isGui3d()`
- `public boolean isBuiltInRenderer()`
- `public TextureAtlasSprite getParticleTexture()`
- `public ItemCameraTransforms getItemCameraTransforms()`
- `public ItemOverrideList getOverrides()`
- `public <any> handlePerspective( ItemCameraTransforms.TransformType cameraTransformType)`