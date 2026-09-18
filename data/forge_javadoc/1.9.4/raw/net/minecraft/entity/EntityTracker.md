---
title: "EntityTracker"
description: "Get all players tracking the given Entity."
package: "net/minecraft/entity"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/EntityTracker.html"
sourceType: javadoc
---

# EntityTracker

## Class signature

```java
public class EntityTracker extends java.lang.Object
```

## Constructors

- `public EntityTracker( WorldServer theWorldIn)`

## Methods

- `public static long getPositionLong(double value)`
- `public static void updateServerPosition( Entity entityIn, double x, double y, double z)`
- `public void trackEntity( Entity entityIn)`
- `public void trackEntity( Entity entityIn, int trackingRange, int updateFrequency)`
- `public void addEntityToTracker( Entity entityIn, int trackingRange, int updateFrequency, boolean sendVelocityUpdates)`
- `public void untrackEntity( Entity entityIn)`
- `public void updateTrackedEntities()`
- `public void updateVisibility( EntityPlayerMP player)`
- `public void sendToAllTrackingEntity( Entity entityIn, Packet <?> packetIn)`
- `public java.util.Set<? extends EntityPlayer > getTrackingPlayers( Entity entity)`
- `public void sendToTrackingAndSelf( Entity entityIn, Packet <?> packetIn)`
- `public void removePlayerFromTrackers( EntityPlayerMP player)`
- `public void sendLeashedEntitiesInChunk( EntityPlayerMP player, Chunk chunkIn)`
- `public void setViewDistance(int p_187252_1_)`

## Description

Get all players tracking the given Entity.
