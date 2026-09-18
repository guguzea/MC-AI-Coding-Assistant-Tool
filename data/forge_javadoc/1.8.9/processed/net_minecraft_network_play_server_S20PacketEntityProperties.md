# S20PacketEntityProperties

## Class signature

```java
public class S20PacketEntityProperties extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S20PacketEntityProperties()`
- `public S20PacketEntityProperties(int entityIdIn, java.util.Collection< IAttributeInstance > p_i45236_2_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityId()`
- `public java.util.List< S20PacketEntityProperties.Snapshot > func_149441_d()`

## Description

Passes this Packet on to the NetHandler for processing.