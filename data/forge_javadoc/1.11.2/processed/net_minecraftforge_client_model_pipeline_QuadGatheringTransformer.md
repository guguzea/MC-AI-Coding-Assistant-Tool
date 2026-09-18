# QuadGatheringTransformer

## Class signature

```java
public abstract class QuadGatheringTransformer extends java.lang.Object implements IVertexConsumer
```

## Constructors

- `public QuadGatheringTransformer()`

## Methods

- `public void setParent( IVertexConsumer parent)`
- `public void setVertexFormat( VertexFormat format)`
- `public VertexFormat getVertexFormat()`
- `public void put(int element, float... data)`
- `protected abstract void processQuad()`