---
title: "PlayerDestroyItemEvent"
description: "public class PlayerDestroyItemEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/player/PlayerDestroyItemEvent.html"
sourceType: javadoc
---

# PlayerDestroyItemEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerDestroyItemEvent

## Class signature

```java
public class PlayerDestroyItemEvent extends PlayerEvent
```

## Constructors

- `PlayerDestroyItemEvent(EntityPlayer player, ItemStack original, EnumHand hand)`

## Methods

- `EnumHand getHand()`
- `ItemStack getOriginal()`
