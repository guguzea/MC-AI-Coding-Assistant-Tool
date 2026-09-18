---
title: "GetCollisionBoxesEvent"
description: "This event is fired during World.collidesWithAnyBlock(AxisAlignedBB) and before returning the list in World.getCollisionBoxes(Entity, AxisAlignedBB) entity contains the entity passed in the World.getC"
package: "net/minecraftforge/event/world"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/world/GetCollisionBoxesEvent.html"
sourceType: javadoc
---

# GetCollisionBoxesEvent

## Class signature

```java
public class GetCollisionBoxesEvent extends WorldEvent
```

## Constructors

- `public GetCollisionBoxesEvent( World world, @Nullable Entity entity, AxisAlignedBB aabb, java.util.List< AxisAlignedBB > collisionBoxesList)`

## Methods

- `public Entity getEntity()`
- `public AxisAlignedBB getAabb()`
- `public java.util.List< AxisAlignedBB > getCollisionBoxesList()`

## Description

This event is fired during World.collidesWithAnyBlock(AxisAlignedBB) and before returning the list in World.getCollisionBoxes(Entity, AxisAlignedBB) entity contains the entity passed in the World.getC
