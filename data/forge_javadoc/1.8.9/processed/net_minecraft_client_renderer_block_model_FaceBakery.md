# FaceBakery

## Class signature

```java
public class FaceBakery extends java.lang.Object
```

## Constructors

- `public FaceBakery()`

## Methods

- `public BakedQuad makeBakedQuad(Vector3f posFrom, Vector3f posTo, BlockPartFace face, TextureAtlasSprite sprite, EnumFacing facing, ModelRotation modelRotationIn, BlockPartRotation partRotation, boolean uvLocked, boolean shade)`
- `public BakedQuad makeBakedQuad(Vector3f posFrom, Vector3f posTo, BlockPartFace face, TextureAtlasSprite sprite, EnumFacing facing, ITransformation modelRotationIn, BlockPartRotation partRotation, boolean uvLocked, boolean shade)`
- `public int rotateVertex(Vector3f position, EnumFacing facing, int vertexIndex, ModelRotation modelRotationIn, boolean uvLocked)`
- `public int rotateVertex(Vector3f position, EnumFacing facing, int vertexIndex, ITransformation modelRotationIn, boolean uvLocked)`
- `public static EnumFacing getFacingFromVertexData(int[] faceData)`
- `public void func_178409_a(int[] p_178409_1_, EnumFacing facing, BlockFaceUV p_178409_3_, TextureAtlasSprite p_178409_4_)`