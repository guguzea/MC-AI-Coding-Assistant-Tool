# VertexBufferConsumer

## Class signature

```java
public class VertexBufferConsumer extends java.lang.Object implements IVertexConsumer
```

## Constructors

- `public VertexBufferConsumer( VertexBuffer renderer)`

## Methods

- `public VertexFormat getVertexFormat()`
- `public void put(int e, float... data)`
- `public void setOffset( BlockPos offset)`
- `public void setQuadTint(int tint)`
- `public void setQuadOrientation( EnumFacing orientation)`
- `public void setApplyDiffuseLighting(boolean diffuse)`

## Description

Assumes VertexFormatElement is present in the VertexBuffer's vertex format.