---
title: "LivingHealEvent"
description: "LivingHealEvent is fired when an Entity is set to be healed. This event is fired whenever an Entity is healed in EntityLivingBase#heal(float) This event is fired via the ForgeHooks#onLivingHeal(Entity"
package: "net/minecraftforge/event/entity/living"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/living/LivingHealEvent.html"
sourceType: javadoc
---

# LivingHealEvent

## Class signature

```java
public class LivingHealEvent extends LivingEvent
```

## Constructors

- `public LivingHealEvent( EntityLivingBase entity, float amount)`

## Methods

- `public float getAmount()`
- `public void setAmount(float amount)`

## Description

LivingHealEvent is fired when an Entity is set to be healed. This event is fired whenever an Entity is healed in EntityLivingBase#heal(float) This event is fired via the ForgeHooks#onLivingHeal(Entity
