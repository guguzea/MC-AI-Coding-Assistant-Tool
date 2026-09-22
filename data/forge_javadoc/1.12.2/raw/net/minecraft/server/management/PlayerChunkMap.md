---
title: "PlayerChunkMap"
description: "public class PlayerChunkMap extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/server/management/PlayerChunkMap.html"
sourceType: javadoc
---

# PlayerChunkMap

**Inheritance:** java.lang.Object → net.minecraft.server.management.PlayerChunkMap

## Class signature

```java
public class PlayerChunkMap extends java.lang.Object
```

## Constructors

- `PlayerChunkMap(WorldServer serverWorld)`

## Methods

- `void addPlayer(EntityPlayerMP player)`
- `boolean contains(int chunkX, int chunkZ)`
- `void entryChanged(PlayerChunkMapEntry entry)`
- `java.util.Iterator<Chunk> getChunkIterator()`
- `PlayerChunkMapEntry getEntry(int x, int z)`
- `static int getFurthestViewableBlock(int distance)`
- `WorldServer getWorldServer()`
- `boolean isPlayerWatchingChunk(EntityPlayerMP player, int chunkX, int chunkZ)`
- `void markBlockForUpdate(BlockPos pos)`
- `void removeEntry(PlayerChunkMapEntry entry)`
- `void removePlayer(EntityPlayerMP player)`
- `void setPlayerViewRadius(int radius)`
- `void tick()`
- `void updateMovingPlayer(EntityPlayerMP player)`
