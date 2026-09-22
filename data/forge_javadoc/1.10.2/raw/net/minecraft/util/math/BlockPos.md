---
title: "BlockPos"
description: "public class BlockPos extends Vec3i"
package: "net/minecraft/util/math"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/util/math/BlockPos.html"
sourceType: javadoc
---

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
- `static java.lang.Iterable<BlockPos> getAllInBox(BlockPos from, BlockPos to)`
- `static java.lang.Iterable<BlockPos.MutableBlockPos> getAllInBoxMutable(BlockPos from, BlockPos to)`
- `BlockPos north()`
- `BlockPos north(int n)`
- `BlockPos offset(EnumFacing facing)`
- `BlockPos offset(EnumFacing facing, int n)`
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
