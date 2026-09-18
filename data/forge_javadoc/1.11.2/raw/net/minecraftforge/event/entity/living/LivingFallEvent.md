---
title: "LivingFallEvent"
description: "LivingFallEvent is fired when an Entity is set to be falling. This event is fired whenever an Entity is set to fall in EntityLivingBase.fall(float, float) . This event is fired via the ForgeHooks.onLi"
package: "net/minecraftforge/event/entity/living"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/living/LivingFallEvent.html"
sourceType: javadoc
---

# LivingFallEvent

## Class signature

```java
public class LivingFallEvent extends LivingEvent
```

## Constructors

- `public LivingFallEvent( EntityLivingBase entity, float distance, float damageMultiplier)`

## Methods

- `public float getDistance()`
- `public void setDistance(float distance)`
- `public float getDamageMultiplier()`
- `public void setDamageMultiplier(float damageMultiplier)`

## Description

LivingFallEvent is fired when an Entity is set to be falling. This event is fired whenever an Entity is set to fall in EntityLivingBase.fall(float, float) . This event is fired via the ForgeHooks.onLi
