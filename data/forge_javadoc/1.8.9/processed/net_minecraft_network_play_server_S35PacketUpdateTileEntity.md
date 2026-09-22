# S35PacketUpdateTileEntity

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S35PacketUpdateTileEntity

## Class signature

```java
public class S35PacketUpdateTileEntity extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S35PacketUpdateTileEntity()`
- `S35PacketUpdateTileEntity(BlockPos blockPosIn, int metadataIn, NBTTagCompound nbtIn)`

## Methods

- `NBTTagCompound getNbtCompound()`
- `BlockPos getPos()`
- `int getTileEntityType()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.