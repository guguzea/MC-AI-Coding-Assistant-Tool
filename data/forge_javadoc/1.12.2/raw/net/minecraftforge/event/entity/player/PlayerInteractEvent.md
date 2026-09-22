---
title: "PlayerInteractEvent"
description: "public class PlayerInteractEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/player/PlayerInteractEvent.html"
sourceType: javadoc
---

# PlayerInteractEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerInteractEvent

## Class signature

```java
public class PlayerInteractEvent extends PlayerEvent
```

## Methods

- `EnumActionResult getCancellationResult()`
- `EnumFacing getFace()`
- `EnumHand getHand()`
- `ItemStack getItemStack()`
- `BlockPos getPos()` — If the interaction was on an entity, will be a BlockPos centered on the entity.
- `Side getSide()`
- `World getWorld()`
- `void setCancellationResult(EnumActionResult result)` — Set the EnumActionResult that will be returned to vanilla if the event is cancelled, instead of calling the relevant method of the event.
