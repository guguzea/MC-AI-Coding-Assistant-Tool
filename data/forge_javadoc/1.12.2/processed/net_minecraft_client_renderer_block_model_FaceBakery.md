# FaceBakery

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.FaceBakery

## Class signature

```java
public class FaceBakery extends java.lang.Object
```

## Constructors

- `FaceBakery()`

## Methods

- `static EnumFacing getFacingFromVertexData(int[] faceData)`
- `BakedQuad makeBakedQuad(Vector3f posFrom, Vector3f posTo, BlockPartFace face, TextureAtlasSprite sprite, EnumFacing facing, ITransformation modelRotationIn, BlockPartRotation partRotation, boolean uvLocked, boolean shade)`
- `BakedQuad makeBakedQuad(Vector3f posFrom, Vector3f posTo, BlockPartFace face, TextureAtlasSprite sprite, EnumFacing facing, ModelRotation modelRotationIn, BlockPartRotation partRotation, boolean uvLocked, boolean shade)`
- `int rotateVertex(Vector3f p_188011_1_, EnumFacing p_188011_2_, int p_188011_3_, ITransformation p_188011_4_)`
- `int rotateVertex(Vector3f p_188011_1_, EnumFacing p_188011_2_, int p_188011_3_, ModelRotation p_188011_4_)`