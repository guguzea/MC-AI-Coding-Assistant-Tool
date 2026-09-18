# S1BPacketEntityAttach

## Class signature

```java
public class S1BPacketEntityAttach extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S1BPacketEntityAttach()`
- `public S1BPacketEntityAttach(int leashIn, Entity entityIn, Entity vehicle)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getLeash()`
- `public int getEntityId()`
- `public int getVehicleEntityId()`

## Description

Passes this Packet on to the NetHandler for processing.