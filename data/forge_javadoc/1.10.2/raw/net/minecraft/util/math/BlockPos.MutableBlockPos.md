---
title: "BlockPos.MutableBlockPos"
description: "public static class BlockPos.MutableBlockPos extends BlockPos"
package: "net/minecraft/util/math"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/util/math/BlockPos.MutableBlockPos.html"
sourceType: javadoc
---

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
- `BlockPos.MutableBlockPos move(EnumFacing facing)`
- `BlockPos.MutableBlockPos move(EnumFacing facing, int p_189534_2_)`
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
