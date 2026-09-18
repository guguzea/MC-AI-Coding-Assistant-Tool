---
title: "LivingDropsEvent"
description: "LivingDropsEvent is fired when an Entity's death causes dropped items to appear. This event is fired whenever an Entity dies and drops items in EntityLivingBase.onDeath(DamageSource) . This event is f"
package: "net/minecraftforge/event/entity/living"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/entity/living/LivingDropsEvent.html"
sourceType: javadoc
---

# LivingDropsEvent

## Class signature

```java
public class LivingDropsEvent extends LivingEvent
```

## Constructors

- `public LivingDropsEvent( EntityLivingBase entity, DamageSource source, java.util.List< EntityItem > drops, int lootingLevel, boolean recentlyHit)`

## Methods

- `public DamageSource getSource()`
- `public java.util.List< EntityItem > getDrops()`
- `public int getLootingLevel()`
- `public boolean isRecentlyHit()`

## Description

LivingDropsEvent is fired when an Entity's death causes dropped items to appear. This event is fired whenever an Entity dies and drops items in EntityLivingBase.onDeath(DamageSource) . This event is f
