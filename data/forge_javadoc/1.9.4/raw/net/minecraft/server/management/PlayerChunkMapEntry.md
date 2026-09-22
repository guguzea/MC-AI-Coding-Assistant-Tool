---
title: "PlayerChunkMapEntry"
description: "public class PlayerChunkMapEntry extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/server/management/PlayerChunkMapEntry.html"
sourceType: javadoc
---

# PlayerChunkMapEntry

**Inheritance:** java.lang.Object → net.minecraft.server.management.PlayerChunkMapEntry

## Class signature

```java
public class PlayerChunkMapEntry extends java.lang.Object
```

## Constructors

- `PlayerChunkMapEntry(PlayerChunkMap p_i1518_1_, int chunkX, int chunkZ)`

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
