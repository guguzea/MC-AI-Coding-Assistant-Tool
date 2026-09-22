# BlockPos.MutableBlockPos

**Inheritance:** java.lang.Object → net.minecraft.util.math.Vec3i → net.minecraft.util.math.BlockPos → net.minecraft.util.math.BlockPos.MutableBlockPos

## Class signature

```java
public static class BlockPos.MutableBlockPos extends BlockPos
```

## Constructors

- `MutableBlockPos()`
- `MutableBlockPos(BlockPos pos)`
- `MutableBlockPos(int x_, int y_, int z_)`

## Methods

- `int getX()`
- `int getY()`
- `int getZ()`
- `BlockPos.MutableBlockPos move(EnumFacing p_189536_1_)`
- `BlockPos.MutableBlockPos move(EnumFacing p_189534_1_, int p_189534_2_)`
- `BlockPos.MutableBlockPos setPos(double p_189532_1_, double p_189532_3_, double p_189532_5_)`
- `BlockPos.MutableBlockPos setPos(Entity p_189535_1_)`
- `BlockPos.MutableBlockPos setPos(int xIn, int yIn, int zIn)`
- `BlockPos.MutableBlockPos setPos(Vec3i p_189533_1_)`
- `void setY(int yIn)`
- `BlockPos toImmutable()`

## Fields

- `protected int x`
- `protected int y`
- `protected int z`