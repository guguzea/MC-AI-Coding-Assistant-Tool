# BlockPos

**Inheritance:** java.lang.Object → net.minecraft.util.math.Vec3i → net.minecraft.util.math.BlockPos

## Class signature

```java
public class BlockPos extends Vec3i
```

## Constructors

- `BlockPos(double x, double y, double z)`
- `BlockPos(Entity source)`
- `BlockPos(int x, int y, int z)`
- `BlockPos(Vec3d vec)`
- `BlockPos(Vec3i source)`

## Methods

- `BlockPos add(double x, double y, double z)`
- `BlockPos add(int x, int y, int z)`
- `BlockPos add(Vec3i vec)`
- `BlockPos crossProduct(Vec3i vec)`
- `BlockPos down()`
- `BlockPos down(int n)`
- `BlockPos east()`
- `BlockPos east(int n)`
- `static BlockPos fromLong(long serialized)`
- `static java.lang.Iterable<BlockPos.MutableBlockPos> func_191531_b(int p_191531_0_, int p_191531_1_, int p_191531_2_, int p_191531_3_, int p_191531_4_, int p_191531_5_)`
- `static java.lang.Iterable<BlockPos> func_191532_a(int p_191532_0_, int p_191532_1_, int p_191532_2_, int p_191532_3_, int p_191532_4_, int p_191532_5_)`
- `static java.lang.Iterable<BlockPos> getAllInBox(BlockPos from, BlockPos to)`
- `static java.lang.Iterable<BlockPos.MutableBlockPos> getAllInBoxMutable(BlockPos from, BlockPos to)`
- `BlockPos north()`
- `BlockPos north(int n)`
- `BlockPos offset(EnumFacing facing)`
- `BlockPos offset(EnumFacing facing, int n)`
- `BlockPos rotate(Rotation rotationIn)`
- `BlockPos south()`
- `BlockPos south(int n)`
- `BlockPos subtract(Vec3i vec)`
- `BlockPos toImmutable()`
- `long toLong()`
- `BlockPos up()`
- `BlockPos up(int n)`
- `BlockPos west()`
- `BlockPos west(int n)`

## Fields

- `static BlockPos ORIGIN`