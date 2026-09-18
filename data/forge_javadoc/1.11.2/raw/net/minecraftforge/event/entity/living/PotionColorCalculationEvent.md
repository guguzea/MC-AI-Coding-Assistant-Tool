---
title: "PotionColorCalculationEvent"
description: "Fires after Potion Color Calculation. this event is not Cancelable This event is fired on the MinecraftForge#EVENT_BUS ."
package: "net/minecraftforge/event/entity/living"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/living/PotionColorCalculationEvent.html"
sourceType: javadoc
---

# PotionColorCalculationEvent

## Class signature

```java
public class PotionColorCalculationEvent extends LivingEvent
```

## Constructors

- `public PotionColorCalculationEvent( EntityLivingBase entity, int color, boolean hideParticle, java.util.Collection< PotionEffect > effectList)`

## Methods

- `public int getColor()`
- `public void setColor(int color)`
- `public boolean areParticlesHidden()`
- `public void shouldHideParticles(boolean hideParticle)`
- `public java.util.Collection< PotionEffect > getEffects()`

## Description

Fires after Potion Color Calculation. this event is not Cancelable This event is fired on the MinecraftForge#EVENT_BUS .
