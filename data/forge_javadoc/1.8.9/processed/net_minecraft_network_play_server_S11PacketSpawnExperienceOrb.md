# S11PacketSpawnExperienceOrb

## Class signature

```java
public class S11PacketSpawnExperienceOrb extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S11PacketSpawnExperienceOrb()`
- `public S11PacketSpawnExperienceOrb( EntityXPOrb xpOrb)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityID()`
- `public int getX()`
- `public int getY()`
- `public int getZ()`
- `public int getXPValue()`

## Description

Passes this Packet on to the NetHandler for processing.