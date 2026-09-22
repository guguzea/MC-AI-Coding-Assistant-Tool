# BlockInfo

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.pipeline.BlockInfo

## Class signature

```java
public class BlockInfo extends java.lang.Object
```

## Constructors

- `BlockInfo(BlockColors colors)`

## Methods

- `float[][][] getAo()`
- `float[][][][] getBlockLight()`
- `BlockPos getBlockPos()`
- `int getCachedMultiplier()`
- `int getCachedTint()`
- `int getColorMultiplier(int tint)`
- `float getShx()`
- `float getShy()`
- `float getShz()`
- `float[][][][] getSkyLight()`
- `IBlockState getState()`
- `boolean[][][] getTranslucent()`
- `IBlockAccess getWorld()`
- `void setBlockPos(BlockPos blockPos)`
- `void setState(IBlockState state)`
- `void setWorld(IBlockAccess world)`
- `void updateLightMatrix()`
- `void updateShift()`
- `void updateShift(boolean ignoreY)`