# S1EPacketRemoveEntityEffect

## Class signature

```java
public class S1EPacketRemoveEntityEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S1EPacketRemoveEntityEffect()`
- `public S1EPacketRemoveEntityEffect(int entityIdIn, PotionEffect effect)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityId()`
- `public int getEffectId()`

## Description

Passes this Packet on to the NetHandler for processing.