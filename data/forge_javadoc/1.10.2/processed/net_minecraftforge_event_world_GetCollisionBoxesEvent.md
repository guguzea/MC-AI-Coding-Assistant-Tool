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

This event is fired after Entity.pushOutOfBlocks(double, double, double) calls World.getCollisionBoxes(AxisAlignedBB) and before returning the list in World.getCollisionBoxes(Entity, AxisAlignedBB) en