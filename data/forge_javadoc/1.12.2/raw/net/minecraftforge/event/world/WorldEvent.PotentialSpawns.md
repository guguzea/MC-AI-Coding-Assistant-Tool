---
title: "WorldEvent.PotentialSpawns"
description: "public static class WorldEvent.PotentialSpawns extends WorldEvent"
package: "net/minecraftforge/event/world"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/world/WorldEvent.PotentialSpawns.html"
sourceType: javadoc
---

# WorldEvent.PotentialSpawns

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.WorldEvent → net.minecraftforge.event.world.WorldEvent.PotentialSpawns

## Class signature

```java
public static class WorldEvent.PotentialSpawns extends WorldEvent
```

## Constructors

- `PotentialSpawns(World world, EnumCreatureType type, BlockPos pos, java.util.List<Biome.SpawnListEntry> oldList)`

## Methods

- `java.util.List<Biome.SpawnListEntry> getList()`
- `BlockPos getPos()`
- `EnumCreatureType getType()`
