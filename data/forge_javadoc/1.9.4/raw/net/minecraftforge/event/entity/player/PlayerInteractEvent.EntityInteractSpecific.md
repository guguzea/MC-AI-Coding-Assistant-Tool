---
title: "PlayerInteractEvent.EntityInteractSpecific"
description: "public static class PlayerInteractEvent.EntityInteractSpecific extends PlayerInteractEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/PlayerInteractEvent.EntityInteractSpecific.html"
sourceType: javadoc
---

# PlayerInteractEvent.EntityInteractSpecific

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerInteractEvent → net.minecraftforge.event.entity.player.PlayerInteractEvent.EntityInteractSpecific

## Class signature

```java
public static class PlayerInteractEvent.EntityInteractSpecific extends PlayerInteractEvent
```

## Constructors

- `EntityInteractSpecific(EntityPlayer player, EnumHand hand, ItemStack stack, Entity target, Vec3d localPos)`

## Methods

- `Vec3d getLocalPos()` — Returns the local interaction position.
- `Entity getTarget()`
