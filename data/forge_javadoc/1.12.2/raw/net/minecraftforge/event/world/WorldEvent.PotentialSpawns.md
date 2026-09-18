---
title: "WorldEvent.PotentialSpawns"
description: "Called by WorldServer to gather a list of all possible entities that can spawn at the specified location. If an entry is added to the list, it needs to be a globally unique instance. The event is call"
package: "net/minecraftforge/event/world"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/world/WorldEvent.PotentialSpawns.html"
sourceType: javadoc
---

# WorldEvent.PotentialSpawns

## Constructors

- `public PotentialSpawns( World world, EnumCreatureType type, BlockPos pos, java.util.List< Biome.SpawnListEntry > oldList)`

## Methods

- `public EnumCreatureType getType()`
- `public BlockPos getPos()`
- `public java.util.List< Biome.SpawnListEntry > getList()`

## Description

Called by WorldServer to gather a list of all possible entities that can spawn at the specified location. If an entry is added to the list, it needs to be a globally unique instance. The event is call
