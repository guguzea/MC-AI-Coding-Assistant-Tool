---
title: "PlayerOpenContainerEvent"
description: "This event is fired when a player attempts to view a container during player tick. setResult ALLOW to allow the container to stay open setResult DENY to force close the container (denying access) DEFA"
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/PlayerOpenContainerEvent.html"
sourceType: javadoc
---

# PlayerOpenContainerEvent

## Class signature

```java
public class PlayerOpenContainerEvent extends PlayerEvent
```

## Constructors

- `public PlayerOpenContainerEvent( EntityPlayer player, Container openContainer)`

## Methods

- `public boolean isCanInteractWith()`

## Description

This event is fired when a player attempts to view a container during player tick. setResult ALLOW to allow the container to stay open setResult DENY to force close the container (denying access) DEFA
