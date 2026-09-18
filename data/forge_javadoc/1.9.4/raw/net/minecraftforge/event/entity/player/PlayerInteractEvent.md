---
title: "PlayerInteractEvent"
description: "PlayerInteractEvent is fired when a player interacts in some way. All subclasses are fired on MinecraftForge.EVENT_BUS . See the individual documentation on each subevent for more details."
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/PlayerInteractEvent.html"
sourceType: javadoc
---

# PlayerInteractEvent

## Class signature

```java
public class PlayerInteractEvent extends PlayerEvent
```

## Methods

- `public EnumHand getHand()`
- `@Nullable public ItemStack getItemStack()`
- `public BlockPos getPos()`
- `@Nullable public EnumFacing getFace()`
- `public World getWorld()`
- `public Side getSide()`

## Description

PlayerInteractEvent is fired when a player interacts in some way. All subclasses are fired on MinecraftForge.EVENT_BUS . See the individual documentation on each subevent for more details.
