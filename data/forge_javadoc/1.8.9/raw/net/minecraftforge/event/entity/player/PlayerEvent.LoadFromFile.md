---
title: "PlayerEvent.LoadFromFile"
description: "public static class PlayerEvent.LoadFromFile extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/entity/player/PlayerEvent.LoadFromFile.html"
sourceType: javadoc
---

# PlayerEvent.LoadFromFile

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerEvent.LoadFromFile

## Class signature

```java
public static class PlayerEvent.LoadFromFile extends PlayerEvent
```

## Constructors

- `LoadFromFile(EntityPlayer player, java.io.File originDirectory, java.lang.String playerUUID)`

## Methods

- `java.io.File getPlayerFile(java.lang.String suffix)` — Construct and return a recommended file for the supplied suffix

## Fields

- `java.io.File playerDirectory` — The directory where player data is being stored.
- `java.lang.String playerUUID` — The UUID is the standard for player related file storage.
