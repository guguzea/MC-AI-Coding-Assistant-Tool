# QuadGatheringTransformer

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.pipeline.QuadGatheringTransformer

## Class signature

```java
public abstract class QuadGatheringTransformer extends java.lang.Object implements IVertexConsumer
```

## Constructors

- `QuadGatheringTransformer()`

## Methods

- `VertexFormat getVertexFormat()`
- `protected abstract void processQuad()`
- `void put(int element, float... data)`
- `void setParent(IVertexConsumer parent)`
- `void setVertexFormat(VertexFormat format)`

## Fields

- `protected byte[] dataLength`
- `protected VertexFormat format`
- `protected IVertexConsumer parent`
- `protected float[][][] quadData`
- `protected int vertices`