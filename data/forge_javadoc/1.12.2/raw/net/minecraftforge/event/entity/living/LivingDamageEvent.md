---
title: "LivingDamageEvent"
description: "LivingDamageEvent is fired just before damage is applied to entity. At this point armor, potion and absorption modifiers have already been applied to damage - this is FINAL value. Also note that appro"
package: "net/minecraftforge/event/entity/living"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/living/LivingDamageEvent.html"
sourceType: javadoc
---

# LivingDamageEvent

## Class signature

```java
public class LivingDamageEvent extends LivingEvent
```

## Constructors

- `public LivingDamageEvent( EntityLivingBase entity, DamageSource source, float amount)`

## Methods

- `public DamageSource getSource()`
- `public float getAmount()`
- `public void setAmount(float amount)`

## Description

LivingDamageEvent is fired just before damage is applied to entity. At this point armor, potion and absorption modifiers have already been applied to damage - this is FINAL value. Also note that appro
