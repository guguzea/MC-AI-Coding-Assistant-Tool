---
title: "ChunkWatchEvent"
description: "public class ChunkWatchEvent extends Event"
package: "net/minecraftforge/event/world"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/world/ChunkWatchEvent.html"
sourceType: javadoc
---

# ChunkWatchEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.ChunkWatchEvent

## Class signature

```java
public class ChunkWatchEvent extends Event
```

## Constructors

- `ChunkWatchEvent(Chunk chunk, EntityPlayerMP player)`
- `@Deprecated ChunkWatchEvent(ChunkPos chunk, EntityPlayerMP player)`

## Methods

- `@Deprecated ChunkPos getChunk()`
- `Chunk getChunkInstance()` — The affected chunk.
- `EntityPlayerMP getPlayer()`
