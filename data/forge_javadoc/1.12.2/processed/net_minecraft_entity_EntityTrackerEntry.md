# EntityTrackerEntry

## Class signature

```java
public class EntityTrackerEntry extends java.lang.Object
```

## Constructors

- `public EntityTrackerEntry( Entity entityIn, int rangeIn, int maxRangeIn, int updateFrequencyIn, boolean sendVelocityUpdatesIn)`

## Methods

- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public void updatePlayerList(java.util.List< EntityPlayer > players)`
- `public void sendPacketToTrackedPlayers( Packet <?> packetIn)`
- `public void sendToTrackingAndSelf( Packet <?> packetIn)`
- `public void sendDestroyEntityPacketToTrackedPlayers()`
- `public void removeFromTrackedPlayers( EntityPlayerMP playerMP)`
- `public void updatePlayerEntity( EntityPlayerMP playerMP)`
- `public boolean isVisibleTo( EntityPlayerMP playerMP)`
- `public void updatePlayerEntities(java.util.List< EntityPlayer > players)`
- `public void removeTrackedPlayerSymmetric( EntityPlayerMP playerMP)`
- `public Entity getTrackedEntity()`
- `public void setMaxRange(int maxRangeIn)`
- `public void resetPlayerVisibility()`