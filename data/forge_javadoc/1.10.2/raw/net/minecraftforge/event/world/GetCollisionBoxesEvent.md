---
title: "GetCollisionBoxesEvent"
description: "public class GetCollisionBoxesEvent extends WorldEvent"
package: "net/minecraftforge/event/world"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/world/GetCollisionBoxesEvent.html"
sourceType: javadoc
---

# GetCollisionBoxesEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.WorldEvent → net.minecraftforge.event.world.GetCollisionBoxesEvent

## Class signature

```java
public class GetCollisionBoxesEvent extends WorldEvent
```

## Constructors

- `GetCollisionBoxesEvent(World world, Entity entity, AxisAlignedBB aabb, java.util.List<AxisAlignedBB> collisionBoxesList)`

## Methods

- `AxisAlignedBB getAabb()`
- `java.util.List<AxisAlignedBB> getCollisionBoxesList()`
- `Entity getEntity()`
