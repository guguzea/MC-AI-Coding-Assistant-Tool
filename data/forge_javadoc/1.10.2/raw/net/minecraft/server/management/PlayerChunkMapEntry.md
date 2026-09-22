---
title: "PlayerChunkMapEntry"
description: "public class PlayerChunkMapEntry extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/server/management/PlayerChunkMapEntry.html"
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
- `boolean hasPlayerMatching(com.google.common.base.Predicate<EntityPlayerMP> predicate)`
- `boolean hasPlayerMatchingInRange(double range, com.google.common.base.Predicate<EntityPlayerMP> predicate)`
- `boolean isSentToPlayers()`
- `boolean providePlayerChunk(boolean canGenerate)`
- `void removePlayer(EntityPlayerMP player)`
- `void sendNearbySpecialEntities(EntityPlayerMP player)`
- `void sendPacket(Packet<?> packetIn)`
- `boolean sentToPlayers()`
- `void update()`
- `void updateChunkInhabitedTime()`
