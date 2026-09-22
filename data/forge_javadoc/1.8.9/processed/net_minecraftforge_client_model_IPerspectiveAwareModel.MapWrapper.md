# IPerspectiveAwareModel.MapWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.IPerspectiveAwareModel.MapWrapper

## Class signature

```java
public static class IPerspectiveAwareModel.MapWrapper extends java.lang.Object implements IPerspectiveAwareModel
```

## Constructors

- `MapWrapper(IFlexibleBakedModel parent, <any> transforms)`

## Methods

- `java.util.List<BakedQuad> getFaceQuads(EnumFacing side)`
- `VertexFormat getFormat()`
- `java.util.List<BakedQuad> getGeneralQuads()`
- `ItemCameraTransforms getItemCameraTransforms()`
- `TextureAtlasSprite getParticleTexture()`
- `static<any> getTransforms(IModelState state)`
- `static<any> getTransforms(ItemCameraTransforms transforms)`
- `static<any> handlePerspective(IFlexibleBakedModel model, <any> transforms, ItemCameraTransforms.TransformType cameraTransformType)`
- `static<any> handlePerspective(IFlexibleBakedModel model, IModelState state, ItemCameraTransforms.TransformType cameraTransformType)`
- `<any> handlePerspective(ItemCameraTransforms.TransformType cameraTransformType)`
- `boolean isAmbientOcclusion()`
- `boolean isBuiltInRenderer()`
- `boolean isGui3d()`