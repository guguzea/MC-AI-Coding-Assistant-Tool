---
title: "LivingExperienceDropEvent"
description: "public class LivingExperienceDropEvent extends LivingEvent"
package: "net/minecraftforge/event/entity/living"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/living/LivingExperienceDropEvent.html"
sourceType: javadoc
---

# LivingExperienceDropEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.living.LivingExperienceDropEvent

## Class signature

```java
public class LivingExperienceDropEvent extends LivingEvent
```

## Constructors

- `LivingExperienceDropEvent(EntityLivingBase entity, EntityPlayer attackingPlayer, int originalExperience)`

## Methods

- `EntityPlayer getAttackingPlayer()`
- `int getDroppedExperience()`
- `int getOriginalExperience()`
- `void setDroppedExperience(int droppedExperience)`
