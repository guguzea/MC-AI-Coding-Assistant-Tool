# IPerspectiveAwareModel.MapWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.IPerspectiveAwareModel.MapWrapper

## Class signature

```java
public static class IPerspectiveAwareModel.MapWrapper extends java.lang.Object implements IPerspectiveAwareModel
```

## Constructors

- `MapWrapper(IBakedModel parent, com.google.common.collect.ImmutableMap<ItemCameraTransforms.TransformType, TRSRTransformation> transforms)`
- `MapWrapper(IBakedModel parent, IModelState state)`

## Methods

- `ItemCameraTransforms getItemCameraTransforms()`
- `ItemOverrideList getOverrides()`
- `TextureAtlasSprite getParticleTexture()`
- `java.util.List<BakedQuad> getQuads(IBlockState state, EnumFacing side, long rand)`
- `static com.google.common.collect.ImmutableMap<ItemCameraTransforms.TransformType, TRSRTransformation> getTransforms(IModelState state)`
- `static com.google.common.collect.ImmutableMap<ItemCameraTransforms.TransformType, TRSRTransformation> getTransforms(ItemCameraTransforms transforms)`
- `static org.apache.commons.lang3.tuple.Pair<? extends IBakedModel, javax.vecmath.Matrix4f> handlePerspective(IBakedModel model, com.google.common.collect.ImmutableMap<ItemCameraTransforms.TransformType, TRSRTransformation> transforms, ItemCameraTransforms.TransformType cameraTransformType)`
- `static org.apache.commons.lang3.tuple.Pair<? extends IBakedModel, javax.vecmath.Matrix4f> handlePerspective(IBakedModel model, IModelState state, ItemCameraTransforms.TransformType cameraTransformType)`
- `org.apache.commons.lang3.tuple.Pair<? extends IBakedModel, javax.vecmath.Matrix4f> handlePerspective(ItemCameraTransforms.TransformType cameraTransformType)`
- `boolean isAmbientOcclusion()`
- `boolean isBuiltInRenderer()`
- `boolean isGui3d()`