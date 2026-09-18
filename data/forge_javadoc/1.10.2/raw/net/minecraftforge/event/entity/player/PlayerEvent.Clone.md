---
title: "PlayerEvent.Clone"
description: "Fired when the EntityPlayer is cloned, typically caused by the network sending a RESPAWN_PLAYER event. Either caused by death, or by traveling from the End to the overworld."
package: "net/minecraftforge/event/entity/player"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/entity/player/PlayerEvent.Clone.html"
sourceType: javadoc
---

# PlayerEvent.Clone

## Constructors

- `public Clone( EntityPlayer _new, EntityPlayer oldPlayer, boolean wasDeath)`

## Methods

- `public EntityPlayer getOriginal()`
- `public boolean isWasDeath()`

## Description

Fired when the EntityPlayer is cloned, typically caused by the network sending a RESPAWN_PLAYER event. Either caused by death, or by traveling from the End to the overworld.
