# S44PacketWorldBorder

## Class signature

```java
public class S44PacketWorldBorder extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S44PacketWorldBorder()`
- `public S44PacketWorldBorder( WorldBorder border, S44PacketWorldBorder.Action actionIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public void func_179788_a( WorldBorder border)`

## Description

Passes this Packet on to the NetHandler for processing.