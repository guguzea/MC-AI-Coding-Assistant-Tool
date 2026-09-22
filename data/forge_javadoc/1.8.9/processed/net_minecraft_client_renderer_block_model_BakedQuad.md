# BakedQuad

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.BakedQuad

## Class signature

```java
public class BakedQuad extends java.lang.Object implements IVertexProducer
```

## Constructors

- `BakedQuad(int[] vertexDataIn, int tintIndexIn, EnumFacing faceIn)`

## Methods

- `EnumFacing getFace()`
- `int getTintIndex()`
- `int[] getVertexData()`
- `boolean hasTintIndex()`
- `void pipe(IVertexConsumer consumer)` — Joined 4 vertex records, each has 7 fields (x, y, z, shadeColor, u, v, ), see FaceBakery.storeVertexData()

## Fields

- `protected EnumFacing face`
- `protected int tintIndex`
- `protected int[] vertexData`