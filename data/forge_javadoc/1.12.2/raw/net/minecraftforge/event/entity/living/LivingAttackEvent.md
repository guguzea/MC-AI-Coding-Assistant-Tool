---
title: "LivingAttackEvent"
description: "LivingAttackEvent is fired when a living Entity is attacked. This event is fired whenever an Entity is attacked in EntityLivingBase.attackEntityFrom(DamageSource, float) and EntityPlayer.attackEntityF"
package: "net/minecraftforge/event/entity/living"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/living/LivingAttackEvent.html"
sourceType: javadoc
---

# LivingAttackEvent

## Class signature

```java
public class LivingAttackEvent extends LivingEvent
```

## Constructors

- `public LivingAttackEvent( EntityLivingBase entity, DamageSource source, float amount)`

## Methods

- `public DamageSource getSource()`
- `public float getAmount()`

## Description

LivingAttackEvent is fired when a living Entity is attacked. This event is fired whenever an Entity is attacked in EntityLivingBase.attackEntityFrom(DamageSource, float) and EntityPlayer.attackEntityF
