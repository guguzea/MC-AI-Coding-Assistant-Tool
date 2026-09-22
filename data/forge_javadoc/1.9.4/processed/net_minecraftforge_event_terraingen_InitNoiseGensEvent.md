# InitNoiseGensEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.WorldEvent → net.minecraftforge.event.terraingen.InitNoiseGensEvent<T>

## Class signature

```java
public class InitNoiseGensEvent<T extends InitNoiseGensEvent.Context> extends WorldEvent
```

## Constructors

- `InitNoiseGensEvent(World world, java.util.Random rand, T original)`

## Methods

- `T getNewValues()`
- `T getOriginal()`
- `java.util.Random getRandom()`