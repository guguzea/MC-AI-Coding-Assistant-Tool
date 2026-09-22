---
title: "EntityTracker"
description: "public class EntityTracker extends java.lang.Object"
package: "net/minecraft/entity"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/EntityTracker.html"
sourceType: javadoc
---

# EntityTracker

**Inheritance:** java.lang.Object → net.minecraft.entity.EntityTracker

## Class signature

```java
public class EntityTracker extends java.lang.Object
```

## Constructors

- `EntityTracker(WorldServer theWorldIn)`

## Methods

- `void addEntityToTracker(Entity entityIn, int trackingRange, int updateFrequency, boolean sendVelocityUpdates)`
- `static long getPositionLong(double value)`
- `java.util.Set<? extends EntityPlayer> getTrackingPlayers(Entity entity)` — Get all players tracking the given Entity.
- `void removePlayerFromTrackers(EntityPlayerMP player)`
- `void sendLeashedEntitiesInChunk(EntityPlayerMP player, Chunk chunkIn)`
- `void sendToAllTrackingEntity(Entity entityIn, Packet<?> packetIn)`
- `void sendToTrackingAndSelf(Entity entityIn, Packet<?> packetIn)`
- `void setViewDistance(int p_187252_1_)`
- `void trackEntity(Entity entityIn)`
- `void trackEntity(Entity entityIn, int trackingRange, int updateFrequency)`
- `void untrackEntity(Entity entityIn)`
- `static void updateServerPosition(Entity entityIn, double x, double y, double z)`
- `void updateTrackedEntities()`
- `void updateVisibility(EntityPlayerMP player)`
