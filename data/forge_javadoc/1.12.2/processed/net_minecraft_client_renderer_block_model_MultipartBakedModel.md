# MultipartBakedModel

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.MultipartBakedModel

## Class signature

```java
public class MultipartBakedModel extends java.lang.Object implements IBakedModel
```

## Constructors

- `MultipartBakedModel(java.util.Map<<any>, IBakedModel> selectorsIn)`

## Methods

- `ItemCameraTransforms getItemCameraTransforms()`
- `ItemOverrideList getOverrides()`
- `TextureAtlasSprite getParticleTexture()`
- `java.util.List<BakedQuad> getQuads(IBlockState state, EnumFacing side, long rand)`
- `boolean isAmbientOcclusion()`
- `boolean isBuiltInRenderer()`
- `boolean isGui3d()`

## Fields

- `protected boolean ambientOcclusion`
- `protected ItemCameraTransforms cameraTransforms`
- `protected boolean gui3D`
- `protected ItemOverrideList overrides`
- `protected TextureAtlasSprite particleTexture`