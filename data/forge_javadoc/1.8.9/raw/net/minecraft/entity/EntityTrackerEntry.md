---
title: "EntityTrackerEntry"
description: "The encoded entity X position."
package: "net/minecraft/entity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/EntityTrackerEntry.html"
sourceType: javadoc
---

# EntityTrackerEntry

## Class signature

```java
public class EntityTrackerEntry extends java.lang.Object
```

## Constructors

- `public EntityTrackerEntry( Entity trackedEntityIn, int trackingDistanceThresholdIn, int updateFrequencyIn, boolean sendVelocityUpdatesIn)`

## Methods

- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public void updatePlayerList(java.util.List< EntityPlayer > p_73122_1_)`
- `public void sendPacketToTrackedPlayers( Packet packetIn)`
- `public void func_151261_b( Packet packetIn)`
- `public void sendDestroyEntityPacketToTrackedPlayers()`
- `public void removeFromTrackedPlayers( EntityPlayerMP playerMP)`
- `public void updatePlayerEntity( EntityPlayerMP playerMP)`
- `public boolean func_180233_c( EntityPlayerMP playerMP)`
- `public void updatePlayerEntities(java.util.List< EntityPlayer > p_73125_1_)`
- `public void removeTrackedPlayerSymmetric( EntityPlayerMP playerMP)`

## Description

The encoded entity X position.
