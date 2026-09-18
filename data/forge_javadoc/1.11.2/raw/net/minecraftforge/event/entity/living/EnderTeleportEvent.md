---
title: "EnderTeleportEvent"
description: "Event for when an Enderman/Shulker teleports or an ender pearl is used. Can be used to either modify the target position, or cancel the teleport outright."
package: "net/minecraftforge/event/entity/living"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/living/EnderTeleportEvent.html"
sourceType: javadoc
---

# EnderTeleportEvent

## Class signature

```java
public class EnderTeleportEvent extends LivingEvent
```

## Constructors

- `public EnderTeleportEvent( EntityLivingBase entity, double targetX, double targetY, double targetZ, float attackDamage)`

## Methods

- `public double getTargetX()`
- `public void setTargetX(double targetX)`
- `public double getTargetY()`
- `public void setTargetY(double targetY)`
- `public double getTargetZ()`
- `public void setTargetZ(double targetZ)`
- `public float getAttackDamage()`
- `public void setAttackDamage(float attackDamage)`

## Description

Event for when an Enderman/Shulker teleports or an ender pearl is used. Can be used to either modify the target position, or cancel the teleport outright.
