# MultiLayerModel.MultiLayerBakedModel

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.MultiLayerModel.MultiLayerBakedModel

## Class signature

```java
public static class MultiLayerModel.MultiLayerBakedModel extends java.lang.Object implements IFlexibleBakedModel, ISmartBlockModel, IPerspectiveAwareModel
```

## Constructors

- `MultiLayerBakedModel(<any> models, IFlexibleBakedModel missing, VertexFormat format, <any> cameraTransforms)`
- `@Deprecated MultiLayerBakedModel(<any> models, VertexFormat format, <any> cameraTransforms)`

## Methods

- `java.util.List<BakedQuad> getFaceQuads(EnumFacing side)`
- `VertexFormat getFormat()`
- `java.util.List<BakedQuad> getGeneralQuads()`
- `ItemCameraTransforms getItemCameraTransforms()`
- `TextureAtlasSprite getParticleTexture()`
- `IBakedModel handleBlockState(IBlockState state)`
- `<any> handlePerspective(ItemCameraTransforms.TransformType cameraTransformType)`
- `boolean isAmbientOcclusion()`
- `boolean isBuiltInRenderer()`
- `boolean isGui3d()`