# BlockInfo

## Class signature

```java
public class BlockInfo extends java.lang.Object
```

## Constructors

- `public BlockInfo( BlockColors colors)`

## Methods

- `public int getColorMultiplier(int tint)`
- `public void updateShift()`
- `public void setWorld( IBlockAccess world)`
- `public void setState( IBlockState state)`
- `public void setBlockPos( BlockPos blockPos)`
- `public void reset()`
- `public void updateLightMatrix()`
- `public void updateFlatLighting()`
- `public IBlockAccess getWorld()`
- `public IBlockState getState()`
- `public BlockPos getBlockPos()`
- `public boolean[][][] getTranslucent()`
- `public float[][][][] getSkyLight()`
- `public float[][][][] getBlockLight()`
- `public float[][][] getAo()`
- `public int[] getPackedLight()`
- `public boolean isFullCube()`
- `public float getShx()`
- `public float getShy()`
- `public float getShz()`
- `public int getCachedTint()`
- `public int getCachedMultiplier()`