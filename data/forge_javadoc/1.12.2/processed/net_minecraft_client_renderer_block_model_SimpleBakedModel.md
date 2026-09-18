# SimpleBakedModel

## Class signature

```java
public class SimpleBakedModel extends java.lang.Object implements IBakedModel
```

## Constructors

- `public SimpleBakedModel(java.util.List< BakedQuad > generalQuadsIn, java.util.Map< EnumFacing ,java.util.List< BakedQuad >> faceQuadsIn, boolean ambientOcclusionIn, boolean gui3dIn, TextureAtlasSprite textureIn, ItemCameraTransforms cameraTransformsIn, ItemOverrideList itemOverrideListIn)`

## Methods

- `public java.util.List< BakedQuad > getQuads( IBlockState state, EnumFacing side, long rand)`
- `public boolean isAmbientOcclusion()`
- `public boolean isGui3d()`
- `public boolean isBuiltInRenderer()`
- `public TextureAtlasSprite getParticleTexture()`
- `public ItemCameraTransforms getItemCameraTransforms()`
- `public ItemOverrideList getOverrides()`