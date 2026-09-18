---
title: "PlayerInteractEvent"
description: "PlayerInteractEvent is fired when a player interacts in some way. This event is fired whenever a player interacts in Minecraft#rightClickMouse(), NetHandlerPlayServer#processPlayerBlockPlacement(C08Pa"
package: "net/minecraftforge/event/entity/player"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/entity/player/PlayerInteractEvent.html"
sourceType: javadoc
---

# PlayerInteractEvent

## Class signature

```java
public class PlayerInteractEvent extends PlayerEvent
```

## Constructors

- `public PlayerInteractEvent( EntityPlayer player, PlayerInteractEvent.Action action, BlockPos pos, EnumFacing face, World world, Vec3 localPos)`

## Methods

- `@Deprecated public PlayerInteractEvent( EntityPlayer player, PlayerInteractEvent.Action action, BlockPos pos, EnumFacing face, World world)`
- `public void setCanceled(boolean cancel)`

## Description

PlayerInteractEvent is fired when a player interacts in some way. This event is fired whenever a player interacts in Minecraft#rightClickMouse(), NetHandlerPlayServer#processPlayerBlockPlacement(C08Pa
