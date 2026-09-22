# ISmartBlockModel.Wrapper

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.ISmartBlockModel.Wrapper

## Class signature

```java
public abstract static class ISmartBlockModel.Wrapper extends java.lang.Object implements ISmartBlockModel, IFlexibleBakedModel
```

## Constructors

- `Wrapper(IFlexibleBakedModel parent)`

## Methods

- `java.util.List<BakedQuad> getFaceQuads(EnumFacing side)`
- `VertexFormat getFormat()`
- `java.util.List<BakedQuad> getGeneralQuads()`
- `ItemCameraTransforms getItemCameraTransforms()`
- `TextureAtlasSprite getParticleTexture()`
- `boolean isAmbientOcclusion()`
- `boolean isBuiltInRenderer()`
- `boolean isGui3d()`

## Fields

- `protected IFlexibleBakedModel parent`