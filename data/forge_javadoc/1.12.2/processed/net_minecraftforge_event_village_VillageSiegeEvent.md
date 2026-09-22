# VillageSiegeEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.village.VillageSiegeEvent

## Class signature

```java
public class VillageSiegeEvent extends Event
```

## Constructors

- `VillageSiegeEvent(VillageSiege siege, World world, EntityPlayer player, Village village, Vec3d attemptedSpawnPos)`

## Methods

- `Vec3d getAttemptedSpawnPos()`
- `EntityPlayer getPlayer()`
- `VillageSiege getSiege()`
- `Village getVillage()`
- `World getWorld()`