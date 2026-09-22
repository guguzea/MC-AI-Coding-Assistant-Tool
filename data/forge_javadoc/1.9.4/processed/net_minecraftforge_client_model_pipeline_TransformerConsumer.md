# TransformerConsumer

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.pipeline.TransformerConsumer

## Class signature

```java
public abstract class TransformerConsumer extends java.lang.Object implements IVertexConsumer
```

## Constructors

- `TransformerConsumer(IVertexConsumer parent)`

## Methods

- `VertexFormat getVertexFormat()`
- `void put(int element, float... data)`
- `protected abstract float[] transform(int element, float... data)`