---
title: "PlayerWakeUpEvent"
description: "This event is fired when the player is waking up. This is merely for purposes of listening for this to happen. There is nothing that can be manipulated with this event."
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/PlayerWakeUpEvent.html"
sourceType: javadoc
---

# PlayerWakeUpEvent

## Class signature

```java
public class PlayerWakeUpEvent extends PlayerEvent
```

## Constructors

- `public PlayerWakeUpEvent( EntityPlayer player, boolean wakeImmediately, boolean updateWorld, boolean setSpawn)`

## Methods

- `public boolean wakeImmediately()`
- `public boolean updateWorld()`
- `public boolean shouldSetSpawn()`

## Description

This event is fired when the player is waking up. This is merely for purposes of listening for this to happen. There is nothing that can be manipulated with this event.
