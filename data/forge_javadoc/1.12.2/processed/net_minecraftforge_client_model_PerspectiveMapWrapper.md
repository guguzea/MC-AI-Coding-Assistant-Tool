# PerspectiveMapWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.PerspectiveMapWrapper

## Class signature

```java
public class PerspectiveMapWrapper extends java.lang.Object implements IBakedModel
```

## Constructors

- `PerspectiveMapWrapper(IBakedModel parent, <any> transforms)`

## Methods

- `ItemCameraTransforms getItemCameraTransforms()`
- `ItemOverrideList getOverrides()`
- `TextureAtlasSprite getParticleTexture()`
- `java.util.List<BakedQuad> getQuads(IBlockState state, EnumFacing side, long rand)`
- `static<any> getTransforms(IModelState state)`
- `static<any> getTransforms(ItemCameraTransforms transforms)`
- `static<any> handlePerspective(IBakedModel model, <any> transforms, ItemCameraTransforms.TransformType cameraTransformType)`
- `static<any> handlePerspective(IBakedModel model, IModelState state, ItemCameraTransforms.TransformType cameraTransformType)`
- `<any> handlePerspective(ItemCameraTransforms.TransformType cameraTransformType)`
- `boolean isAmbientOcclusion()`
- `boolean isAmbientOcclusion(IBlockState state)`
- `boolean isBuiltInRenderer()`
- `boolean isGui3d()`