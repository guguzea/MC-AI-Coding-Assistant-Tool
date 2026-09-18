# S0APacketUseBed

## Class signature

```java
public class S0APacketUseBed extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S0APacketUseBed()`
- `public S0APacketUseBed( EntityPlayer player, BlockPos bedPosIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public EntityPlayer getPlayer( World worldIn)`
- `public BlockPos getBedPosition()`

## Description

Passes this Packet on to the NetHandler for processing.