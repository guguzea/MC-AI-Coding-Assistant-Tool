# SPacketSpawnExperienceOrb

## Class signature

```java
public class SPacketSpawnExperienceOrb extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketSpawnExperienceOrb()`
- `public SPacketSpawnExperienceOrb( EntityXPOrb orb)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityID()`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public int getXPValue()`