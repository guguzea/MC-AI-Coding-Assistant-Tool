---
title: "PlayerChunkMapEntry"
description: "public class PlayerChunkMapEntry extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/server/management/PlayerChunkMapEntry.html"
sourceType: javadoc
---

# PlayerChunkMapEntry

**Inheritance:** java.lang.Object → net.minecraft.server.management.PlayerChunkMapEntry

## Class signature

```java
public class PlayerChunkMapEntry extends java.lang.Object
```

## Constructors

- `PlayerChunkMapEntry(PlayerChunkMap mapIn, int chunkX, int chunkZ)`

## Methods

- `void addPlayer(EntityPlayerMP player)`
- `void blockChanged(int x, int y, int z)`
- `boolean containsPlayer(EntityPlayerMP player)`
- `Chunk getChunk()`
- `double getClosestPlayerDistance()`
- `ChunkPos getPos()`
- `java.util.List<EntityPlayerMP> getWatchingPlayers()`
- `boolean hasPlayerMatching(<any> predicate)`
- `boolean hasPlayerMatchingInRange(double range, <any> predicate)`
- `boolean isSentToPlayers()`
- `boolean providePlayerChunk(boolean canGenerate)`
- `void removePlayer(EntityPlayerMP player)`
- `void sendPacket(Packet<?> packetIn)`
- `void sendToPlayer(EntityPlayerMP player)`
- `boolean sendToPlayers()`
- `void update()`
- `void updateChunkInhabitedTime()`
