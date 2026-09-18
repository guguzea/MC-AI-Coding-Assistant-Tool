# C0BPacketEntityAction

## Class signature

```java
public class C0BPacketEntityAction extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C0BPacketEntityAction()`
- `public C0BPacketEntityAction( Entity entity, C0BPacketEntityAction.Action action)`
- `public C0BPacketEntityAction( Entity entity, C0BPacketEntityAction.Action action, int auxData)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public C0BPacketEntityAction.Action getAction()`
- `public int getAuxData()`

## Description

Passes this Packet on to the NetHandler for processing.