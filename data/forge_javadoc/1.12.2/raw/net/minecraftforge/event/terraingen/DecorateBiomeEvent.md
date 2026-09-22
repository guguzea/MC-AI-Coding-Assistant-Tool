---
title: "DecorateBiomeEvent"
description: "public class DecorateBiomeEvent extends Event"
package: "net/minecraftforge/event/terraingen"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/terraingen/DecorateBiomeEvent.html"
sourceType: javadoc
---

# DecorateBiomeEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.terraingen.DecorateBiomeEvent

## Class signature

```java
public class DecorateBiomeEvent extends Event
```

## Constructors

- `@Deprecated DecorateBiomeEvent(World world, java.util.Random rand, BlockPos pos)`
- `DecorateBiomeEvent(World world, java.util.Random rand, ChunkPos chunkPos)`

## Methods

- `ChunkPos getChunkPos()`
- `@Deprecated BlockPos getPos()` — Deprecated. use getChunkPos() or DecorateBiomeEvent.Decorate.getPlacementPos() instead.
- `java.util.Random getRand()`
- `World getWorld()`
