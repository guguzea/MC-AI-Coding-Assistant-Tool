---
title: "ZombieEvent.SummonAidEvent"
description: "public static class ZombieEvent.SummonAidEvent extends ZombieEvent"
package: "net/minecraftforge/event/entity/living"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/living/ZombieEvent.SummonAidEvent.html"
sourceType: javadoc
---

# ZombieEvent.SummonAidEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.ZombieEvent → net.minecraftforge.event.entity.living.ZombieEvent.SummonAidEvent

## Class signature

```java
public static class ZombieEvent.SummonAidEvent extends ZombieEvent
```

## Constructors

- `SummonAidEvent(EntityZombie entity, World world, int x, int y, int z, EntityLivingBase attacker, double summonChance)`

## Methods

- `EntityLivingBase getAttacker()`
- `EntityZombie getCustomSummonedAid()` — Populate this field to have a custom zombie instead of a normal zombie summoned
- `double getSummonChance()`
- `World getWorld()`
- `int getX()`
- `int getY()`
- `int getZ()`
- `void setCustomSummonedAid(EntityZombie customSummonedAid)`
