# C14PacketTabComplete

## Class signature

```java
public class C14PacketTabComplete extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C14PacketTabComplete()`
- `public C14PacketTabComplete(java.lang.String msg)`
- `public C14PacketTabComplete(java.lang.String msg, BlockPos target)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public java.lang.String getMessage()`
- `public BlockPos getTargetBlock()`

## Description

Passes this Packet on to the NetHandler for processing.