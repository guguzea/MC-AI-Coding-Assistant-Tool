---
title: "PotionColorCalculationEvent"
description: "public class PotionColorCalculationEvent extends LivingEvent"
package: "net/minecraftforge/event/entity/living"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/living/PotionColorCalculationEvent.html"
sourceType: javadoc
---

# PotionColorCalculationEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.living.PotionColorCalculationEvent

## Class signature

```java
public class PotionColorCalculationEvent extends LivingEvent
```

## Constructors

- `PotionColorCalculationEvent(EntityLivingBase entity, int color, boolean hideParticle, java.util.Collection<PotionEffect> effectList)`

## Methods

- `boolean areParticlesHidden()`
- `int getColor()`
- `java.util.Collection<PotionEffect> getEffects()` — Note that returned list is unmodifiable.
- `void setColor(int color)`
- `void shouldHideParticles(boolean hideParticle)`
