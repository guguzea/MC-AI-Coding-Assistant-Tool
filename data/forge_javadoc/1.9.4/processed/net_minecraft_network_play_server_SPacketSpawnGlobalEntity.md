# SPacketSpawnGlobalEntity

## Class signature

```java
public class SPacketSpawnGlobalEntity extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketSpawnGlobalEntity()`
- `public SPacketSpawnGlobalEntity( Entity entityIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityId()`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public int getType()`