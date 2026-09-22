---
title: "PlayerInteractEvent.RightClickBlock"
description: "public static class PlayerInteractEvent.RightClickBlock extends PlayerInteractEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/PlayerInteractEvent.RightClickBlock.html"
sourceType: javadoc
---

# PlayerInteractEvent.RightClickBlock

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerInteractEvent → net.minecraftforge.event.entity.player.PlayerInteractEvent.RightClickBlock

## Class signature

```java
public static class PlayerInteractEvent.RightClickBlock extends PlayerInteractEvent
```

## Constructors

- `RightClickBlock(EntityPlayer player, EnumHand hand, ItemStack stack, BlockPos pos, EnumFacing face, Vec3d hitVec)`

## Methods

- `Vec3d getHitVec()`
- `Event.Result getUseBlock()`
- `Event.Result getUseItem()`
- `void setCanceled(boolean canceled)` — Sets the state of this event, not all events are cancelable, and any attempt to cancel a event that can't be will result in a IllegalArgumentException.
- `void setUseBlock(Event.Result triggerBlock)` — DENY: Block will never be used.
- `void setUseItem(Event.Result triggerItem)` — DENY: The item will never be used.
