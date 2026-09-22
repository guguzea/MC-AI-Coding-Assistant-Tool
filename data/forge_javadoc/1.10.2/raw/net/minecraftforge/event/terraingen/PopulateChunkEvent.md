---
title: "PopulateChunkEvent"
description: "public class PopulateChunkEvent extends ChunkGeneratorEvent"
package: "net/minecraftforge/event/terraingen"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/terraingen/PopulateChunkEvent.html"
sourceType: javadoc
---

# PopulateChunkEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.terraingen.ChunkGeneratorEvent → net.minecraftforge.event.terraingen.PopulateChunkEvent

## Class signature

```java
public class PopulateChunkEvent extends ChunkGeneratorEvent
```

## Constructors

- `PopulateChunkEvent(IChunkGenerator gen, World world, java.util.Random rand, int chunkX, int chunkZ, boolean hasVillageGenerated)`

## Methods

- `int getChunkX()`
- `int getChunkZ()`
- `java.util.Random getRand()`
- `World getWorld()`
- `boolean isHasVillageGenerated()`
