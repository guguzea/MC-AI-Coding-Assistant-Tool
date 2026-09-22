---
title: "PlayerDestroyItemEvent"
description: "public class PlayerDestroyItemEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/entity/player/PlayerDestroyItemEvent.html"
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
