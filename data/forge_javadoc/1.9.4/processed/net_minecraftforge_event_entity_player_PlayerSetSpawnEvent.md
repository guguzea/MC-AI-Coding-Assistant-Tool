# PlayerSetSpawnEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerSetSpawnEvent

## Class signature

```java
public class PlayerSetSpawnEvent extends PlayerEvent
```

## Constructors

- `PlayerSetSpawnEvent(EntityPlayer player, BlockPos newSpawn, boolean forced)`

## Methods

- `BlockPos getNewSpawn()`
- `boolean isForced()` — This event is called before a player's spawn point is changed.