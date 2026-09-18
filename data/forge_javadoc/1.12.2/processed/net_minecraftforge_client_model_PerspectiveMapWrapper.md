# PerspectiveMapWrapper

## Class signature

```java
public class PerspectiveMapWrapper extends java.lang.Object implements IBakedModel
```

## Constructors

- `public PerspectiveMapWrapper( IBakedModel parent, <any> transforms)`

## Methods

- `public static <any> getTransforms( IModelState state)`
- `public static <any> getTransforms( ItemCameraTransforms transforms)`
- `public static <any> handlePerspective( IBakedModel model, <any> transforms, ItemCameraTransforms.TransformType cameraTransformType)`
- `public static <any> handlePerspective( IBakedModel model, IModelState state, ItemCameraTransforms.TransformType cameraTransformType)`
- `public boolean isAmbientOcclusion()`
- `public boolean isAmbientOcclusion( IBlockState state)`
- `public boolean isGui3d()`
- `public boolean isBuiltInRenderer()`
- `public TextureAtlasSprite getParticleTexture()`
- `public ItemCameraTransforms getItemCameraTransforms()`
- `public java.util.List< BakedQuad > getQuads( IBlockState state, EnumFacing side, long rand)`
- `public ItemOverrideList getOverrides()`
- `public <any> handlePerspective( ItemCameraTransforms.TransformType cameraTransformType)`