---
title: "LivingDropsEvent"
description: "public class LivingDropsEvent extends LivingEvent"
package: "net/minecraftforge/event/entity/living"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/living/LivingDropsEvent.html"
sourceType: javadoc
---

# LivingDropsEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.living.LivingDropsEvent

## Class signature

```java
public class LivingDropsEvent extends LivingEvent
```

## Constructors

- `LivingDropsEvent(EntityLivingBase entity, DamageSource source, java.util.List<EntityItem> drops, int lootingLevel, boolean recentlyHit)`

## Methods

- `java.util.List<EntityItem> getDrops()`
- `int getLootingLevel()`
- `DamageSource getSource()`
- `boolean isRecentlyHit()`
