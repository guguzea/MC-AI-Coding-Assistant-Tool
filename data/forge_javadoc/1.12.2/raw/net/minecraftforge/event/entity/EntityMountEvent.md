---
title: "EntityMountEvent"
description: "public class EntityMountEvent extends EntityEvent"
package: "net/minecraftforge/event/entity"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/EntityMountEvent.html"
sourceType: javadoc
---

# EntityMountEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.EntityMountEvent

## Class signature

```java
public class EntityMountEvent extends EntityEvent
```

## Constructors

- `EntityMountEvent(Entity entityMounting, Entity entityBeingMounted, World entityWorld, boolean isMounting)`

## Methods

- `Entity getEntityBeingMounted()`
- `Entity getEntityMounting()`
- `World getWorldObj()`
- `boolean isDismounting()`
- `boolean isMounting()`
