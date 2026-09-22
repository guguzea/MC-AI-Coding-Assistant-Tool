---
title: "EntityTrackerEntry"
description: "public class EntityTrackerEntry extends java.lang.Object"
package: "net/minecraft/entity"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/EntityTrackerEntry.html"
sourceType: javadoc
---

# EntityTrackerEntry

**Inheritance:** java.lang.Object → net.minecraft.entity.EntityTrackerEntry

## Class signature

```java
public class EntityTrackerEntry extends java.lang.Object
```

## Constructors

- `EntityTrackerEntry(Entity entityIn, int p_i46837_2_, int p_i46837_3_, int p_i46837_4_, boolean p_i46837_5_)`

## Methods

- `boolean equals(java.lang.Object p_equals_1_)`
- `Entity getTrackedEntity()`
- `int hashCode()`
- `boolean isVisibleTo(EntityPlayerMP playerMP)`
- `void removeFromTrackedPlayers(EntityPlayerMP playerMP)`
- `void removeTrackedPlayerSymmetric(EntityPlayerMP playerMP)`
- `void resetPlayerVisibility()`
- `void sendDestroyEntityPacketToTrackedPlayers()`
- `void sendPacketToTrackedPlayers(Packet<?> packetIn)`
- `void sendToTrackingAndSelf(Packet<?> packetIn)`
- `void setMaxRange(int p_187259_1_)`
- `void updatePlayerEntities(java.util.List<EntityPlayer> players)`
- `void updatePlayerEntity(EntityPlayerMP playerMP)`
- `void updatePlayerList(java.util.List<EntityPlayer> players)`

## Fields

- `boolean playerEntitiesUpdated`
- `java.util.Set<EntityPlayerMP> trackingPlayers`
- `int updateCounter`
