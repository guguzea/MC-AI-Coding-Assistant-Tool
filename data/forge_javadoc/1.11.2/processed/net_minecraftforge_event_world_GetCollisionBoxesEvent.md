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