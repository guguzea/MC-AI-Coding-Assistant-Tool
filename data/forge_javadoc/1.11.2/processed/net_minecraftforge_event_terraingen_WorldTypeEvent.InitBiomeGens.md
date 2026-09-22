# WorldTypeEvent.InitBiomeGens

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.terraingen.WorldTypeEvent → net.minecraftforge.event.terraingen.WorldTypeEvent.InitBiomeGens

## Class signature

```java
public static class WorldTypeEvent.InitBiomeGens extends WorldTypeEvent
```

## Constructors

- `InitBiomeGens(WorldType worldType, long seed, GenLayer [] original)`

## Methods

- `GenLayer [] getNewBiomeGens()`
- `GenLayer [] getOriginalBiomeGens()`
- `long getSeed()`
- `void setNewBiomeGens(GenLayer [] newBiomeGens)`