---
title: "VillageSiegeEvent"
description: "VillageSiegeEvent is fired just before a zombie siege finds a successful location in VillageSiege.trySetupSiege() , to give mods the chance to stop the siege. This event is Cancelable ; canceling stop"
package: "net/minecraftforge/event/village"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/village/VillageSiegeEvent.html"
sourceType: javadoc
---

# VillageSiegeEvent

## Class signature

```java
public class VillageSiegeEvent extends Event
```

## Constructors

- `public VillageSiegeEvent( VillageSiege siege, World world, EntityPlayer player, Village village, Vec3d attemptedSpawnPos)`

## Methods

- `public VillageSiege getSiege()`
- `public World getWorld()`
- `public EntityPlayer getPlayer()`
- `public Village getVillage()`
- `public Vec3d getAttemptedSpawnPos()`

## Description

VillageSiegeEvent is fired just before a zombie siege finds a successful location in VillageSiege.trySetupSiege() , to give mods the chance to stop the siege. This event is Cancelable ; canceling stop
