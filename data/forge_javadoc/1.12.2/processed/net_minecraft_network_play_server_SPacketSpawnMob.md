# SPacketSpawnMob

## Class signature

```java
public class SPacketSpawnMob extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketSpawnMob()`
- `public SPacketSpawnMob( EntityLivingBase entityIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.util.List< EntityDataManager.DataEntry <?>> getDataManagerEntries()`
- `public int getEntityID()`
- `public java.util.UUID getUniqueId()`
- `public int getEntityType()`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public int getVelocityX()`
- `public int getVelocityY()`
- `public int getVelocityZ()`
- `public byte getYaw()`
- `public byte getPitch()`
- `public byte getHeadPitch()`