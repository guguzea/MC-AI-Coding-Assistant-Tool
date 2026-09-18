---
title: "AnimalTameEvent"
description: "This event is fired when an EntityAnimal is tamed. It is fired via ForgeEventFactory.onAnimalTame(EntityAnimal, EntityPlayer) . Forge fires this event for applicable vanilla animals, mods need to fire"
package: "net/minecraftforge/event/entity/living"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/living/AnimalTameEvent.html"
sourceType: javadoc
---

# AnimalTameEvent

## Class signature

```java
public class AnimalTameEvent extends LivingEvent
```

## Constructors

- `public AnimalTameEvent( EntityAnimal animal, EntityPlayer tamer)`

## Methods

- `public EntityAnimal getAnimal()`
- `public EntityPlayer getTamer()`

## Description

This event is fired when an EntityAnimal is tamed. It is fired via ForgeEventFactory.onAnimalTame(EntityAnimal, EntityPlayer) . Forge fires this event for applicable vanilla animals, mods need to fire
