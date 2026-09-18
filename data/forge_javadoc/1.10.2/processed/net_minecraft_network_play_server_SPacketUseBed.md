# SPacketUseBed

## Class signature

```java
public class SPacketUseBed extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketUseBed()`
- `public SPacketUseBed( EntityPlayer player, BlockPos posIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public EntityPlayer getPlayer( World worldIn)`
- `public BlockPos getBedPosition()`