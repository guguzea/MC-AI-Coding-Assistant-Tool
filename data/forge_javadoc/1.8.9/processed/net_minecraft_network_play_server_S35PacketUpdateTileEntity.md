# S35PacketUpdateTileEntity

## Class signature

```java
public class S35PacketUpdateTileEntity extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S35PacketUpdateTileEntity()`
- `public S35PacketUpdateTileEntity( BlockPos blockPosIn, int metadataIn, NBTTagCompound nbtIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public BlockPos getPos()`
- `public int getTileEntityType()`
- `public NBTTagCompound getNbtCompound()`

## Description

Passes this Packet on to the NetHandler for processing.