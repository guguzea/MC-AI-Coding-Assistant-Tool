---
title: "PlayerChunkMap"
description: "public class PlayerChunkMap extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/server/management/PlayerChunkMap.html"
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

- `void addEntry(PlayerChunkMapEntry entry)`
- `void addPlayer(EntityPlayerMP player)`
- `boolean contains(int chunkX, int chunkZ)`
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
- `void updateMountedMovingPlayer(EntityPlayerMP player)`
