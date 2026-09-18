---
title: "CriticalHitEvent"
description: "This event is fired whenever a player attacks an Entity in EntityPlayer#attackTargetEntityWithCurrentItem(Entity). This event is not Cancelable . This event has a result. Event.HasResult DEFAULT: mean"
package: "net/minecraftforge/event/entity/player"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/player/CriticalHitEvent.html"
sourceType: javadoc
---

# CriticalHitEvent

## Class signature

```java
public class CriticalHitEvent extends PlayerEvent
```

## Constructors

- `public CriticalHitEvent( EntityPlayer player, Entity target, float damageModifier, boolean vanillaCritical)`

## Methods

- `public Entity getTarget()`
- `public void setDamageModifier(float mod)`
- `public float getDamageModifier()`
- `public float getOldDamageModifier()`
- `public boolean isVanillaCritical()`

## Description

This event is fired whenever a player attacks an Entity in EntityPlayer#attackTargetEntityWithCurrentItem(Entity). This event is not Cancelable . This event has a result. Event.HasResult DEFAULT: mean
