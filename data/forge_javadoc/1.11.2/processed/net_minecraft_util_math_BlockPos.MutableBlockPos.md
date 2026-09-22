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

- `BlockPos add(double x, double y, double z)`
- `BlockPos add(int x, int y, int z)`
- `int getX()`
- `int getY()`
- `int getZ()`
- `BlockPos.MutableBlockPos move(EnumFacing facing)`
- `BlockPos.MutableBlockPos move(EnumFacing facing, int p_189534_2_)`
- `BlockPos offset(EnumFacing facing, int n)`
- `BlockPos rotate(Rotation rotationIn)`
- `BlockPos.MutableBlockPos setPos(double xIn, double yIn, double zIn)`
- `BlockPos.MutableBlockPos setPos(Entity entityIn)`
- `BlockPos.MutableBlockPos setPos(int xIn, int yIn, int zIn)`
- `BlockPos.MutableBlockPos setPos(Vec3i vec)`
- `void setY(int yIn)`
- `BlockPos toImmutable()`

## Fields

- `protected int x`
- `protected int y`
- `protected int z`