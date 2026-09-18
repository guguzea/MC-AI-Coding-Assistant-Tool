---
title: "LivingHealEvent"
description: "LivingHealEvent is fired when an Entity is set to be healed. This event is fired whenever an Entity is healed in EntityLivingBase.heal(float) This event is fired via the ForgeEventFactory.onLivingHeal"
package: "net/minecraftforge/event/entity/living"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/entity/living/LivingHealEvent.html"
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

LivingHealEvent is fired when an Entity is set to be healed. This event is fired whenever an Entity is healed in EntityLivingBase.heal(float) This event is fired via the ForgeEventFactory.onLivingHeal
