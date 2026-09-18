# BakedQuad

## Class signature

```java
public class BakedQuad extends java.lang.Object implements IVertexProducer
```

## Constructors

- `public BakedQuad(int[] vertexDataIn, int tintIndexIn, EnumFacing faceIn, TextureAtlasSprite spriteIn, boolean applyDiffuseLighting, VertexFormat format)`

## Methods

- `@Deprecated public BakedQuad(int[] vertexDataIn, int tintIndexIn, EnumFacing faceIn, TextureAtlasSprite spriteIn)`
- `public TextureAtlasSprite getSprite()`
- `public int[] getVertexData()`
- `public boolean hasTintIndex()`
- `public int getTintIndex()`
- `public EnumFacing getFace()`
- `public void pipe( IVertexConsumer consumer)`
- `public VertexFormat getFormat()`
- `public boolean shouldApplyDiffuseLighting()`

## Description

Deprecated. Use constructor with the format argument.