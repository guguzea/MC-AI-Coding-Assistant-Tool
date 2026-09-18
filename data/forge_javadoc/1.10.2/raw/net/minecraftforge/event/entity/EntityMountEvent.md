---
title: "EntityMountEvent"
description: "This event gets fired whenever a entity mounts/dismounts another entity. entityBeingMounted can be null , be sure to check for that. This event is Cancelable . If this event is canceled, the entity do"
package: "net/minecraftforge/event/entity"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/entity/EntityMountEvent.html"
sourceType: javadoc
---

# EntityMountEvent

## Class signature

```java
public class EntityMountEvent extends EntityEvent
```

## Constructors

- `public EntityMountEvent( Entity entityMounting, Entity entityBeingMounted, World entityWorld, boolean isMounting)`

## Methods

- `public boolean isMounting()`
- `public boolean isDismounting()`
- `public Entity getEntityMounting()`
- `public Entity getEntityBeingMounted()`
- `public World getWorldObj()`

## Description

This event gets fired whenever a entity mounts/dismounts another entity. entityBeingMounted can be null , be sure to check for that. This event is Cancelable . If this event is canceled, the entity do
