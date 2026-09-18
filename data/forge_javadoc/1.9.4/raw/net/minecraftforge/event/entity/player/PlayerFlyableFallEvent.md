---
title: "PlayerFlyableFallEvent"
description: "Occurs when a player falls, but is able to fly. Doesn't need to be cancelable, this is mainly for notification purposes."
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/PlayerFlyableFallEvent.html"
sourceType: javadoc
---

# PlayerFlyableFallEvent

## Class signature

```java
public class PlayerFlyableFallEvent extends PlayerEvent
```

## Constructors

- `public PlayerFlyableFallEvent( EntityPlayer player, float distance, float multiplier)`

## Methods

- `public float getDistance()`
- `public void setDistance(float distance)`
- `public float getMultiplier()`
- `public void setMultiplier(float multiplier)`

## Description

Occurs when a player falls, but is able to fly. Doesn't need to be cancelable, this is mainly for notification purposes.
