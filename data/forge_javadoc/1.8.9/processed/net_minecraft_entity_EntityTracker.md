# EntityTracker

**Inheritance:** java.lang.Object → net.minecraft.entity.EntityTracker

## Class signature

```java
public class EntityTracker extends java.lang.Object
```

## Constructors

- `EntityTracker(WorldServer theWorldIn)`

## Methods

- `void addEntityToTracker(Entity entityIn, int trackingRange, int updateFrequency, boolean sendVelocityUpdates)` — Args : Entity, trackingRange, updateFrequency, sendVelocityUpdates
- `void func_151248_b(Entity entityIn, Packet p_151248_2_)`
- `void func_180245_a(EntityPlayerMP p_180245_1_)`
- `void func_85172_a(EntityPlayerMP p_85172_1_, Chunk p_85172_2_)`
- `java.util.Set<? extends EntityPlayer> getTrackingPlayers(Entity entity)` — Get all players tracking the given Entity.
- `void removePlayerFromTrackers(EntityPlayerMP p_72787_1_)`
- `void sendToAllTrackingEntity(Entity entityIn, Packet p_151247_2_)`
- `void trackEntity(Entity p_72786_1_)`
- `void trackEntity(Entity entityIn, int trackingRange, int updateFrequency)`
- `void untrackEntity(Entity entityIn)`
- `void updateTrackedEntities()`