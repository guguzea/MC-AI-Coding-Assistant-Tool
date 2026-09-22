# WorldEvent.PotentialSpawns

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.WorldEvent → net.minecraftforge.event.world.WorldEvent.PotentialSpawns

## Class signature

```java
public static class WorldEvent.PotentialSpawns extends WorldEvent
```

## Constructors

- `PotentialSpawns(World world, EnumCreatureType type, BlockPos pos, java.util.List<Biome.SpawnListEntry> oldList)`

## Methods

- `java.util.List<Biome.SpawnListEntry> getList()`
- `BlockPos getPos()`
- `EnumCreatureType getType()`