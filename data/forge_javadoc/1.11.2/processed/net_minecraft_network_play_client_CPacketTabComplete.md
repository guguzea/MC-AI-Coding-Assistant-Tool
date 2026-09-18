# CPacketTabComplete

## Class signature

```java
public class CPacketTabComplete extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketTabComplete()`
- `public CPacketTabComplete(java.lang.String messageIn, @Nullable BlockPos targetBlockIn, boolean hasTargetBlockIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public java.lang.String getMessage()`
- `@Nullable public BlockPos getTargetBlock()`
- `public boolean hasTargetBlock()`