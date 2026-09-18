---
title: "BlockPos"
description: ""
package: "net/minecraft/util/math"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/util/math/BlockPos.html"
sourceType: javadoc
---

# BlockPos

## Constructors

- `public BlockPos(int x, int y, int z)`
- `public BlockPos(double x, double y, double z)`
- `public BlockPos( Entity source)`
- `public BlockPos( Vec3d vec)`
- `public BlockPos( Vec3i source)`

## Methods

- `public BlockPos add(double x, double y, double z)`
- `public BlockPos add(int x, int y, int z)`
- `public BlockPos add( Vec3i vec)`
- `public BlockPos subtract( Vec3i vec)`
- `public BlockPos up()`
- `public BlockPos up(int n)`
- `public BlockPos down()`
- `public BlockPos down(int n)`
- `public BlockPos north()`
- `public BlockPos north(int n)`
- `public BlockPos south()`
- `public BlockPos south(int n)`
- `public BlockPos west()`
- `public BlockPos west(int n)`
- `public BlockPos east()`
- `public BlockPos east(int n)`
- `public BlockPos offset( EnumFacing facing)`
- `public BlockPos offset( EnumFacing facing, int n)`
- `public BlockPos rotate( Rotation rotationIn)`
- `public BlockPos crossProduct( Vec3i vec)`
- `public long toLong()`
- `public static BlockPos fromLong(long serialized)`
- `public static java.lang.Iterable< BlockPos > getAllInBox( BlockPos from, BlockPos to)`
- `public static java.lang.Iterable< BlockPos > func_191532_a(int p_191532_0_, int p_191532_1_, int p_191532_2_, int p_191532_3_, int p_191532_4_, int p_191532_5_)`
- `public BlockPos toImmutable()`
- `public static java.lang.Iterable< BlockPos.MutableBlockPos > getAllInBoxMutable( BlockPos from, BlockPos to)`
- `public static java.lang.Iterable< BlockPos.MutableBlockPos > func_191531_b(int p_191531_0_, int p_191531_1_, int p_191531_2_, int p_191531_3_, int p_191531_4_, int p_191531_5_)`
