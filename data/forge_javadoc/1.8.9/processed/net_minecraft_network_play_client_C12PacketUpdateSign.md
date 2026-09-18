# C12PacketUpdateSign

## Class signature

```java
public class C12PacketUpdateSign extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C12PacketUpdateSign()`
- `public C12PacketUpdateSign( BlockPos pos, IChatComponent [] lines)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public BlockPos getPosition()`
- `public IChatComponent [] getLines()`

## Description

Passes this Packet on to the NetHandler for processing.