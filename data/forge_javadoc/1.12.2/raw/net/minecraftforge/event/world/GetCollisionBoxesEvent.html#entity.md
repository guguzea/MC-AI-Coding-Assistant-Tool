---
title: "GetCollisionBoxesEvent.html#entity"
description: "This event is fired during World.collidesWithAnyBlock(AxisAlignedBB) and before returning the list in World.getCollisionBoxes(Entity, AxisAlignedBB) entity contains the entity passed in the World.getC"
package: "net/minecraftforge/event/world"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/world/GetCollisionBoxesEvent.html#entity"
sourceType: javadoc
---

# GetCollisionBoxesEvent.html#entity

## Class signature

```java
public class GetCollisionBoxesEvent extends WorldEvent
```

## Methods

- `public GetCollisionBoxesEvent( World world, Entity entity, AxisAlignedBB aabb, java.util.List< AxisAlignedBB > collisionBoxesList)`
- `public Entity getEntity()`
- `public AxisAlignedBB getAabb()`
- `public java.util.List< AxisAlignedBB > getCollisionBoxesList()`

## Description

This event is fired during World.collidesWithAnyBlock(AxisAlignedBB) and before returning the list in World.getCollisionBoxes(Entity, AxisAlignedBB) entity contains the entity passed in the World.getC
