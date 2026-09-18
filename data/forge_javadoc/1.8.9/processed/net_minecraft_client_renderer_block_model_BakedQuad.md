# BakedQuad

## Class signature

```java
public class BakedQuad extends java.lang.Object implements IVertexProducer
```

## Constructors

- `public BakedQuad(int[] vertexDataIn, int tintIndexIn, EnumFacing faceIn)`

## Methods

- `public void pipe( IVertexConsumer consumer)`
- `public int[] getVertexData()`
- `public boolean hasTintIndex()`
- `public int getTintIndex()`
- `public EnumFacing getFace()`

## Description

Joined 4 vertex records, each has 7 fields (x, y, z, shadeColor, u, v, ), see FaceBakery.storeVertexData()