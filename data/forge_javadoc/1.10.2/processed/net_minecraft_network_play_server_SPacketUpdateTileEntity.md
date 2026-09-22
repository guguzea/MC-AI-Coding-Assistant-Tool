# SPacketUpdateTileEntity

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketUpdateTileEntity

## Class signature

```java
public class SPacketUpdateTileEntity extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketUpdateTileEntity()`
- `SPacketUpdateTileEntity(BlockPos blockPosIn, int metadataIn, NBTTagCompound compoundIn)`

## Methods

- `NBTTagCompound getNbtCompound()`
- `BlockPos getPos()`
- `int getTileEntityType()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`