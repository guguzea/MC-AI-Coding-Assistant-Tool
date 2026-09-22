---
title: "BlockPos"
description: "public class BlockPos extends Vec3i"
package: "net/minecraft/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/BlockPos.html"
sourceType: javadoc
---

# BlockPos

**Inheritance:** java.lang.Object → net.minecraft.util.Vec3i → net.minecraft.util.BlockPos

## Class signature

```java
public class BlockPos extends Vec3i
```

## Constructors

- `BlockPos(double x, double y, double z)`
- `BlockPos(Entity source)`
- `BlockPos(int x, int y, int z)`
- `BlockPos(Vec3 source)`
- `BlockPos(Vec3i source)`

## Methods

- `BlockPos add(double x, double y, double z)` — Add the given coordinates to the coordinates of this BlockPos
- `BlockPos add(int x, int y, int z)` — Add the given coordinates to the coordinates of this BlockPos
- `BlockPos add(Vec3i vec)` — Add the given Vector to this BlockPos
- `BlockPos crossProduct(Vec3i vec)` — Calculate the cross product of this and the given Vector
- `BlockPos down()` — Offset this BlockPos 1 block down
- `BlockPos down(int n)` — Offset this BlockPos n blocks down
- `BlockPos east()` — Offset this BlockPos 1 block in eastern direction
- `BlockPos east(int n)` — Offset this BlockPos n blocks in eastern direction
- `static BlockPos fromLong(long serialized)` — Create a BlockPos from a serialized long value (created by toLong)
- `static java.lang.Iterable<BlockPos> getAllInBox(BlockPos from, BlockPos to)`
- `static java.lang.Iterable<BlockPos.MutableBlockPos> getAllInBoxMutable(BlockPos from, BlockPos to)`
- `BlockPos getImmutable()` — Returns a version of this BlockPos that is guaranteed to be Immutable.
- `BlockPos north()` — Offset this BlockPos 1 block in northern direction
- `BlockPos north(int n)` — Offset this BlockPos n blocks in northern direction
- `BlockPos offset(EnumFacing facing)` — Offset this BlockPos 1 block in the given direction
- `BlockPos offset(EnumFacing facing, int n)` — Offsets this BlockPos n blocks in the given direction
- `BlockPos south()` — Offset this BlockPos 1 block in southern direction
- `BlockPos south(int n)` — Offset this BlockPos n blocks in southern direction
- `BlockPos subtract(Vec3i vec)` — Subtract the given Vector from this BlockPos
- `long toLong()` — Serialize this BlockPos into a long value
- `BlockPos up()` — Offset this BlockPos 1 block up
- `BlockPos up(int n)` — Offset this BlockPos n blocks up
- `BlockPos west()` — Offset this BlockPos 1 block in western direction
- `BlockPos west(int n)` — Offset this BlockPos n blocks in western direction

## Fields

- `static BlockPos ORIGIN` — The BlockPos with all coordinates 0
