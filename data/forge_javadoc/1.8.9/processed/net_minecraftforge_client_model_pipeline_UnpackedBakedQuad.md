# UnpackedBakedQuad

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.BakedQuad → net.minecraftforge.client.model.pipeline.UnpackedBakedQuad

## Class signature

```java
public class UnpackedBakedQuad extends BakedQuad
```

## Constructors

- `UnpackedBakedQuad(float[][][] unpackedData, int tint, EnumFacing orientation, VertexFormat format)`

## Methods

- `int[] getVertexData()`
- `void pipe(IVertexConsumer consumer)` — Joined 4 vertex records, each has 7 fields (x, y, z, shadeColor, u, v, ), see FaceBakery.storeVertexData()

## Fields

- `protected VertexFormat format`
- `protected boolean packed`
- `protected float[][][] unpackedData`