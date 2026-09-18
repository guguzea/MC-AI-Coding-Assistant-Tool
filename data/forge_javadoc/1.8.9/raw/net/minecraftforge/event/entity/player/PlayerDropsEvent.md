---
title: "PlayerDropsEvent"
description: "Child class of LivingDropEvent that is fired specifically when a player dies. Canceling the event will prevent ALL drops from entering the world."
package: "net/minecraftforge/event/entity/player"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/entity/player/PlayerDropsEvent.html"
sourceType: javadoc
---

# PlayerDropsEvent

## Class signature

```java
public class PlayerDropsEvent extends LivingDropsEvent
```

## Constructors

- `public PlayerDropsEvent( EntityPlayer entity, DamageSource source, java.util.List< EntityItem > drops, boolean recentlyHit)`

## Description

Child class of LivingDropEvent that is fired specifically when a player dies. Canceling the event will prevent ALL drops from entering the world.
