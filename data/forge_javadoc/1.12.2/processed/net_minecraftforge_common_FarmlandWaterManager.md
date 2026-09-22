# FarmlandWaterManager

**Inheritance:** java.lang.Object → net.minecraftforge.common.FarmlandWaterManager

## Class signature

```java
public class FarmlandWaterManager extends java.lang.Object
```

## Constructors

- `FarmlandWaterManager()`

## Methods

- `static AABBTicket addAABBTicket(World world, AxisAlignedBB aabb)` — Convenience method to add a ticket that is backed by an AABB.
- `@Deprecated static<T extends SimpleTicket<Vec3d>> T addCustomTicket(World world, T ticket, ChunkPos ... chunkPoses)`
- `static<T extends SimpleTicket<Vec3d>> T addCustomTicket(World world, T ticket, ChunkPos masterChunk, ChunkPos ... additionalChunks)` — Adds a custom ticket.
- `static boolean hasBlockWaterTicket(World world, BlockPos pos)` — Tests if a block is in a region that is watered by blocks.