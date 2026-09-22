# BakedModelWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.BakedModelWrapper<T>

## Class signature

```java
public abstract class BakedModelWrapper<T extends IBakedModel> extends java.lang.Object implements IBakedModel
```

## Constructors

- `BakedModelWrapper(T originalModel)`

## Methods

- `ItemCameraTransforms getItemCameraTransforms()`
- `ItemOverrideList getOverrides()`
- `TextureAtlasSprite getParticleTexture()`
- `java.util.List<BakedQuad> getQuads(IBlockState state, EnumFacing side, long rand)`
- `<any> handlePerspective(ItemCameraTransforms.TransformType cameraTransformType)`
- `boolean isAmbientOcclusion()`
- `boolean isAmbientOcclusion(IBlockState state)`
- `boolean isBuiltInRenderer()`
- `boolean isGui3d()`

## Fields

- `protected T originalModel`