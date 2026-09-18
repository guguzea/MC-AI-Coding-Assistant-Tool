# EntityTracker

## Class signature

```java
public class EntityTracker extends java.lang.Object
```

## Constructors

- `public EntityTracker( WorldServer theWorldIn)`

## Methods

- `public void trackEntity( Entity p_72786_1_)`
- `public void trackEntity( Entity entityIn, int trackingRange, int updateFrequency)`
- `public void addEntityToTracker( Entity entityIn, int trackingRange, int updateFrequency, boolean sendVelocityUpdates)`
- `public void untrackEntity( Entity entityIn)`
- `public void updateTrackedEntities()`
- `public void func_180245_a( EntityPlayerMP p_180245_1_)`
- `public void sendToAllTrackingEntity( Entity entityIn, Packet p_151247_2_)`
- `public void func_151248_b( Entity entityIn, Packet p_151248_2_)`
- `public void removePlayerFromTrackers( EntityPlayerMP p_72787_1_)`
- `public void func_85172_a( EntityPlayerMP p_85172_1_, Chunk p_85172_2_)`
- `public java.util.Set<? extends EntityPlayer > getTrackingPlayers( Entity entity)`

## Description

Args : Entity, trackingRange, updateFrequency, sendVelocityUpdates