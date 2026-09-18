# UnpackedBakedQuad

## Class signature

```java
public class UnpackedBakedQuad extends BakedQuad
```

## Constructors

- `public UnpackedBakedQuad(float[][][] unpackedData, int tint, EnumFacing orientation, VertexFormat format)`

## Methods

- `public int[] getVertexData()`
- `public void pipe( IVertexConsumer consumer)`

## Description

Joined 4 vertex records, each has 7 fields (x, y, z, shadeColor, u, v, ), see FaceBakery.storeVertexData()