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