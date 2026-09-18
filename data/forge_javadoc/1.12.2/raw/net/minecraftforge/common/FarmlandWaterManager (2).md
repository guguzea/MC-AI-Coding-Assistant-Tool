---
title: "FarmlandWaterManager"
description: "Convenience method to add a ticket that is backed by an AABB."
package: "net/minecraftforge/common"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/FarmlandWaterManager.html"
sourceType: javadoc
---

# FarmlandWaterManager

## Class signature

```java
public class FarmlandWaterManager extends java.lang.Object
```

## Constructors

- `public FarmlandWaterManager()`

## Methods

- `@Deprecated public static <T extends SimpleTicket < Vec3d >> T addCustomTicket( World world, T ticket, ChunkPos ... chunkPoses)`
- `public static <T extends SimpleTicket < Vec3d >> T addCustomTicket( World world, T ticket, ChunkPos masterChunk, ChunkPos ... additionalChunks)`
- `public static AABBTicket addAABBTicket( World world, AxisAlignedBB aabb)`
- `public static boolean hasBlockWaterTicket( World world, BlockPos pos)`

## Description

Convenience method to add a ticket that is backed by an AABB.
