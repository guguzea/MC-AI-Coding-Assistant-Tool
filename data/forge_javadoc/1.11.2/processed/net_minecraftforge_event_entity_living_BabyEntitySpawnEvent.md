# BabyEntitySpawnEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.living.BabyEntitySpawnEvent

## Class signature

```java
public class BabyEntitySpawnEvent extends Event
```

## Constructors

- `BabyEntitySpawnEvent(EntityLiving parentA, EntityLiving parentB, EntityAgeable proposedChild)`

## Methods

- `EntityPlayer getCausedByPlayer()`
- `EntityAgeable getChild()`
- `EntityLiving getParentA()`
- `EntityLiving getParentB()`
- `void setChild(EntityAgeable proposedChild)`