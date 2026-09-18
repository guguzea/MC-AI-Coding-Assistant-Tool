# SPacketUpdateTileEntity

## Class signature

```java
public class SPacketUpdateTileEntity extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketUpdateTileEntity()`
- `public SPacketUpdateTileEntity( BlockPos blockPosIn, int tileEntityTypeIn, NBTTagCompound compoundIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public BlockPos getPos()`
- `public int getTileEntityType()`
- `public NBTTagCompound getNbtCompound()`