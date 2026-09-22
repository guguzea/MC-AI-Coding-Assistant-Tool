# EntityTrackerEntry

**Inheritance:** java.lang.Object → net.minecraft.entity.EntityTrackerEntry

## Class signature

```java
public class EntityTrackerEntry extends java.lang.Object
```

## Constructors

- `EntityTrackerEntry(Entity entityIn, int rangeIn, int maxRangeIn, int updateFrequencyIn, boolean sendVelocityUpdatesIn)`

## Methods

- `boolean equals(java.lang.Object p_equals_1_)`
- `Entity getTrackedEntity()`
- `int hashCode()`
- `boolean isVisibleTo(EntityPlayerMP playerMP)`
- `void removeFromTrackedPlayers(EntityPlayerMP playerMP)`
- `void removeTrackedPlayerSymmetric(EntityPlayerMP playerMP)`
- `void resetPlayerVisibility()`
- `void sendDestroyEntityPacketToTrackedPlayers()`
- `void sendPacketToTrackedPlayers(Packet<?> packetIn)`
- `void sendToTrackingAndSelf(Packet<?> packetIn)`
- `void setMaxRange(int maxRangeIn)`
- `void updatePlayerEntities(java.util.List<EntityPlayer> players)`
- `void updatePlayerEntity(EntityPlayerMP playerMP)`
- `void updatePlayerList(java.util.List<EntityPlayer> players)`

## Fields

- `boolean playerEntitiesUpdated`
- `java.util.Set<EntityPlayerMP> trackingPlayers`
- `int updateCounter`