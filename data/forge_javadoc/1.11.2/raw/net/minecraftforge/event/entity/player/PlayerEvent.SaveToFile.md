---
title: "PlayerEvent.SaveToFile"
description: "public static class PlayerEvent.SaveToFile extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/player/PlayerEvent.SaveToFile.html"
sourceType: javadoc
---

# PlayerEvent.SaveToFile

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerEvent.SaveToFile

## Class signature

```java
public static class PlayerEvent.SaveToFile extends PlayerEvent
```

## Constructors

- `SaveToFile(EntityPlayer player, java.io.File originDirectory, java.lang.String playerUUID)`

## Methods

- `java.io.File getPlayerDirectory()` — The directory where player data is being stored.
- `java.io.File getPlayerFile(java.lang.String suffix)` — Construct and return a recommended file for the supplied suffix
- `java.lang.String getPlayerUUID()` — The UUID is the standard for player related file storage.
