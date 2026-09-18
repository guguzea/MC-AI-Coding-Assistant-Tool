# IVertexConsumer

## Class signature

```java
public interface IVertexConsumer
```

## Methods

- `VertexFormat getVertexFormat()`
- `void setQuadTint(int tint)`
- `void setQuadOrientation( EnumFacing orientation)`
- `void setApplyDiffuseLighting(boolean diffuse)`
- `void setTexture( TextureAtlasSprite texture)`
- `void put(int element, float... data)`

## Description

Assumes that the data length is not less than e.getElementCount(). Also assumes that element index passed will increment from 0 to format.getElementCount() - 1. Normal, Color and UV are assumed to be