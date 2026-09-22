---
title: "EntityTracker"
description: "public class EntityTracker extends java.lang.Object"
package: "net/minecraft/entity"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/EntityTracker.html"
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

- `static long getPositionLong(double value)`
- `java.util.Set<? extends EntityPlayer> getTrackingPlayers(Entity entity)` — Get all players tracking the given Entity.
- `void removePlayerFromTrackers(EntityPlayerMP player)`
- `void sendLeashedEntitiesInChunk(EntityPlayerMP player, Chunk chunkIn)`
- `void sendToTracking(Entity entityIn, Packet<?> packetIn)`
- `void sendToTrackingAndSelf(Entity entityIn, Packet<?> packetIn)`
- `void setViewDistance(int p_187252_1_)`
- `void tick()`
- `void track(Entity entityIn)`
- `void track(Entity entityIn, int trackingRange, int updateFrequency)`
- `void track(Entity entityIn, int trackingRange, int updateFrequency, boolean sendVelocityUpdates)`
- `void untrack(Entity entityIn)`
- `static void updateServerPosition(Entity entityIn, double x, double y, double z)`
- `void updateVisibility(EntityPlayerMP player)`
