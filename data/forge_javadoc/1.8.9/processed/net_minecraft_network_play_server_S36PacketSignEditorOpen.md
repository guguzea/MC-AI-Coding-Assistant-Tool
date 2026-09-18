# S36PacketSignEditorOpen

## Class signature

```java
public class S36PacketSignEditorOpen extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S36PacketSignEditorOpen()`
- `public S36PacketSignEditorOpen( BlockPos signPositionIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public BlockPos getSignPosition()`

## Description

Passes this Packet on to the NetHandler for processing.