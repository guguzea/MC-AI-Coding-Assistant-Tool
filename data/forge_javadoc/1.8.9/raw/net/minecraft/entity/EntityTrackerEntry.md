---
title: "EntityTrackerEntry"
description: "public class EntityTrackerEntry extends java.lang.Object"
package: "net/minecraft/entity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/EntityTrackerEntry.html"
sourceType: javadoc
---

# EntityTrackerEntry

**Inheritance:** java.lang.Object → net.minecraft.entity.EntityTrackerEntry

## Class signature

```java
public class EntityTrackerEntry extends java.lang.Object
```

## Constructors

- `EntityTrackerEntry(Entity trackedEntityIn, int trackingDistanceThresholdIn, int updateFrequencyIn, boolean sendVelocityUpdatesIn)`

## Methods

- `boolean equals(java.lang.Object p_equals_1_)`
- `void func_151261_b(Packet packetIn)`
- `boolean func_180233_c(EntityPlayerMP playerMP)`
- `int hashCode()`
- `void removeFromTrackedPlayers(EntityPlayerMP playerMP)`
- `void removeTrackedPlayerSymmetric(EntityPlayerMP playerMP)` — Remove a tracked player from our list and tell the tracked player to destroy us from their world.
- `void sendDestroyEntityPacketToTrackedPlayers()`
- `void sendPacketToTrackedPlayers(Packet packetIn)` — Send the given packet to all players tracking this entity.
- `void updatePlayerEntities(java.util.List<EntityPlayer> p_73125_1_)`
- `void updatePlayerEntity(EntityPlayerMP playerMP)`
- `void updatePlayerList(java.util.List<EntityPlayer> p_73122_1_)`

## Fields

- `int encodedPosX` — The encoded entity X position.
- `int encodedPosY` — The encoded entity Y position.
- `int encodedPosZ` — The encoded entity Z position.
- `int encodedRotationPitch` — The encoded entity pitch rotation.
- `int encodedRotationYaw` — The encoded entity yaw rotation.
- `int lastHeadMotion`
- `double lastTrackedEntityMotionX`
- `double lastTrackedEntityMotionY`
- `double motionZ`
- `boolean playerEntitiesUpdated`
- `Entity trackedEntity` — The entity that this EntityTrackerEntry tracks.
- `int trackingDistanceThreshold`
- `java.util.Set<EntityPlayerMP> trackingPlayers`
- `int updateCounter`
- `int updateFrequency` — check for sync when ticks % updateFrequency==0
