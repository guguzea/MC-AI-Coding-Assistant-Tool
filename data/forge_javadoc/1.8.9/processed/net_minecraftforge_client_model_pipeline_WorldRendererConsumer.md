# WorldRendererConsumer

## Class signature

```java
public class WorldRendererConsumer extends java.lang.Object implements IVertexConsumer
```

## Constructors

- `public WorldRendererConsumer( WorldRenderer renderer)`

## Methods

- `public VertexFormat getVertexFormat()`
- `public void put(int e, float... data)`
- `public void setOffset( BlockPos offset)`
- `public void setQuadTint(int tint)`
- `public void setQuadOrientation( EnumFacing orientation)`
- `public void setQuadColored()`

## Description

Assumes VertexFormatElement is present in the WorlRenderer's vertex format.