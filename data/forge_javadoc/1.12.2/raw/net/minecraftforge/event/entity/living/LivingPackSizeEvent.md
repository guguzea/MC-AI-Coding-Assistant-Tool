---
title: "LivingPackSizeEvent"
description: "public class LivingPackSizeEvent extends LivingEvent"
package: "net/minecraftforge/event/entity/living"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/living/LivingPackSizeEvent.html"
sourceType: javadoc
---

# LivingPackSizeEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.living.LivingPackSizeEvent

## Class signature

```java
public class LivingPackSizeEvent extends LivingEvent
```

## Constructors

- `LivingPackSizeEvent(EntityLiving entity)`

## Methods

- `int getMaxPackSize()` — This event is fired when the spawning system determines the maximum amount of the selected entity that can spawn at the same time.
- `void setMaxPackSize(int maxPackSize)`
