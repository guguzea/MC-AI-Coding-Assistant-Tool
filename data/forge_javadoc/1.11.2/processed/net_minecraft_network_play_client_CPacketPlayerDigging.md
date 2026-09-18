# CPacketPlayerDigging

## Class signature

```java
public class CPacketPlayerDigging extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketPlayerDigging()`
- `public CPacketPlayerDigging( CPacketPlayerDigging.Action actionIn, BlockPos posIn, EnumFacing facingIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public BlockPos getPosition()`
- `public EnumFacing getFacing()`
- `public CPacketPlayerDigging.Action getAction()`