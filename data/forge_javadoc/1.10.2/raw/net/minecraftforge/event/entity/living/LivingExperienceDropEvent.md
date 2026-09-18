---
title: "LivingExperienceDropEvent"
description: "Event for when an entity drops experience on its death, can be used to change the amount of experience points dropped or completely prevent dropping of experience by canceling the event."
package: "net/minecraftforge/event/entity/living"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/entity/living/LivingExperienceDropEvent.html"
sourceType: javadoc
---

# LivingExperienceDropEvent

## Class signature

```java
public class LivingExperienceDropEvent extends LivingEvent
```

## Constructors

- `public LivingExperienceDropEvent( EntityLivingBase entity, EntityPlayer attackingPlayer, int originalExperience)`

## Methods

- `public int getDroppedExperience()`
- `public void setDroppedExperience(int droppedExperience)`
- `public EntityPlayer getAttackingPlayer()`
- `public int getOriginalExperience()`

## Description

Event for when an entity drops experience on its death, can be used to change the amount of experience points dropped or completely prevent dropping of experience by canceling the event.
