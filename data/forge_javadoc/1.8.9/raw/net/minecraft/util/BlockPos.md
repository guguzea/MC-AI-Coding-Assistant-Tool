---
title: "BlockPos"
description: "The BlockPos with all coordinates 0"
package: "net/minecraft/util"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/BlockPos.html"
sourceType: javadoc
---

# BlockPos

## Class signature

```java
public class BlockPos extends Vec3i
```

## Constructors

- `public BlockPos(int x, int y, int z)`
- `public BlockPos(double x, double y, double z)`
- `public BlockPos( Entity source)`
- `public BlockPos( Vec3 source)`
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
- `public BlockPos crossProduct( Vec3i vec)`
- `public long toLong()`
- `public static BlockPos fromLong(long serialized)`
- `public static java.lang.Iterable< BlockPos > getAllInBox( BlockPos from, BlockPos to)`
- `public static java.lang.Iterable< BlockPos.MutableBlockPos > getAllInBoxMutable( BlockPos from, BlockPos to)`
- `public BlockPos getImmutable()`

## Description

The BlockPos with all coordinates 0
