---
title: "PlayerSetSpawnEvent"
description: "This event is called before a player's spawn point is changed."
package: "net/minecraftforge/event/entity/player"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/player/PlayerSetSpawnEvent.html"
sourceType: javadoc
---

# PlayerSetSpawnEvent

## Class signature

```java
public class PlayerSetSpawnEvent extends PlayerEvent
```

## Constructors

- `public PlayerSetSpawnEvent( EntityPlayer player, BlockPos newSpawn, boolean forced)`

## Methods

- `public boolean isForced()`
- `public BlockPos getNewSpawn()`

## Description

This event is called before a player's spawn point is changed.
