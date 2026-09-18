---
title: "BlockEvent.EntityMultiPlaceEvent"
description: "Fired when a single block placement triggers the creation of multiple blocks(e.g. placing a bed block). The block returned by BlockEvent.state and its related methods is the block where the placed blo"
package: "net/minecraftforge/event/world"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/world/BlockEvent.EntityMultiPlaceEvent.html"
sourceType: javadoc
---

# BlockEvent.EntityMultiPlaceEvent

## Constructors

- `public EntityMultiPlaceEvent(java.util.List< BlockSnapshot > blockSnapshots, IBlockState placedAgainst, Entity entity)`

## Methods

- `public java.util.List< BlockSnapshot > getReplacedBlockSnapshots()`

## Description

Fired when a single block placement triggers the creation of multiple blocks(e.g. placing a bed block). The block returned by BlockEvent.state and its related methods is the block where the placed blo
