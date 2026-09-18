# Frustum

## Class signature

```java
public class Frustum extends java.lang.Object implements ICamera
```

## Constructors

- `public Frustum()`
- `public Frustum( ClippingHelper p_i46196_1_)`

## Methods

- `public void setPosition(double p_78547_1_, double p_78547_3_, double p_78547_5_)`
- `public boolean isBoxInFrustum(double p_78548_1_, double p_78548_3_, double p_78548_5_, double p_78548_7_, double p_78548_9_, double p_78548_11_)`
- `public boolean isBoundingBoxInFrustum( AxisAlignedBB p_78546_1_)`

## Description

Returns true if the bounding box is inside all 6 clipping planes, otherwise returns false.