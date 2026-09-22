# SimpleBakedModel

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.SimpleBakedModel

## Class signature

```java
public class SimpleBakedModel extends java.lang.Object implements IBakedModel
```

## Constructors

- `SimpleBakedModel(java.util.List<BakedQuad> generalQuadsIn, java.util.Map<EnumFacing, java.util.List<BakedQuad>> faceQuadsIn, boolean ambientOcclusionIn, boolean gui3dIn, TextureAtlasSprite textureIn, ItemCameraTransforms cameraTransformsIn, ItemOverrideList itemOverrideListIn)`

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
- `protected java.util.Map<EnumFacing, java.util.List<BakedQuad>> faceQuads`
- `protected java.util.List<BakedQuad> generalQuads`
- `protected boolean gui3d`
- `protected ItemOverrideList itemOverrideList`
- `protected TextureAtlasSprite texture`