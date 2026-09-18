---
title: "BlockEvent.MultiPlaceEvent"
description: "Fired when a single block placement action of a player triggers the creation of multiple blocks(e.g. placing a bed block). The block returned by BlockEvent.state and its related methods is the block w"
package: "net/minecraftforge/event/world"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/world/BlockEvent.MultiPlaceEvent.html"
sourceType: javadoc
---

# BlockEvent.MultiPlaceEvent

## Constructors

- `public MultiPlaceEvent(java.util.List< BlockSnapshot > blockSnapshots, IBlockState placedAgainst, EntityPlayer player)`

## Methods

- `public java.util.List< BlockSnapshot > getReplacedBlockSnapshots()`

## Description

Fired when a single block placement action of a player triggers the creation of multiple blocks(e.g. placing a bed block). The block returned by BlockEvent.state and its related methods is the block w
