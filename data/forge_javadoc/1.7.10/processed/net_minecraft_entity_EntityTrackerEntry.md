# EntityTrackerEntry

**Inheritance:** java.lang.Object → net.minecraft.entity.EntityTrackerEntry

## Class signature

```java
public class EntityTrackerEntry extends java.lang.Object
```

## Constructors

- `EntityTrackerEntry(Entity p_i1525_1_, int p_i1525_2_, int p_i1525_3_, boolean p_i1525_4_)`

## Methods

- `boolean equals(java.lang.Object p_equals_1_)`
- `void func_151259_a(Packet p_151259_1_)`
- `void func_151261_b(Packet p_151261_1_)`
- `int hashCode()`
- `void informAllAssociatedPlayersOfItemDestruction()`
- `void removeFromWatchingList(EntityPlayerMP p_73118_1_)`
- `void removePlayerFromTracker(EntityPlayerMP p_73123_1_)`
- `void sendEventsToPlayers(java.util.List p_73125_1_)`
- `void sendLocationToAllClients(java.util.List p_73122_1_)`
- `void tryStartWachingThis(EntityPlayerMP p_73117_1_)`

## Fields

- `int blocksDistanceThreshold`
- `int lastHeadMotion`
- `int lastPitch`
- `int lastScaledXPosition`
- `int lastScaledYPosition`
- `int lastScaledZPosition`
- `int lastYaw`
- `double motionX`
- `double motionY`
- `double motionZ`
- `Entity myEntity`
- `boolean playerEntitiesUpdated`
- `int ticks`
- `java.util.Set trackingPlayers`
- `int updateFrequency`