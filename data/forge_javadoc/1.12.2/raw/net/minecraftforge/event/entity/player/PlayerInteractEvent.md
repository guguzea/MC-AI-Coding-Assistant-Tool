---
title: "PlayerInteractEvent"
description: "PlayerInteractEvent is fired when a player interacts in some way. All subclasses are fired on MinecraftForge.EVENT_BUS . See the individual documentation on each subevent for more details."
package: "net/minecraftforge/event/entity/player"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/player/PlayerInteractEvent.html"
sourceType: javadoc
---

# PlayerInteractEvent

## Class signature

```java
public class PlayerInteractEvent extends PlayerEvent
```

## Methods

- `public EnumHand getHand()`
- `public ItemStack getItemStack()`
- `public BlockPos getPos()`
- `public EnumFacing getFace()`
- `public World getWorld()`
- `public Side getSide()`
- `public EnumActionResult getCancellationResult()`
- `public void setCancellationResult( EnumActionResult result)`

## Description

PlayerInteractEvent is fired when a player interacts in some way. All subclasses are fired on MinecraftForge.EVENT_BUS . See the individual documentation on each subevent for more details.
