# S49PacketUpdateEntityNBT

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S49PacketUpdateEntityNBT

## Class signature

```java
public class S49PacketUpdateEntityNBT extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S49PacketUpdateEntityNBT()`
- `S49PacketUpdateEntityNBT(int entityIdIn, NBTTagCompound tagCompoundIn)`

## Methods

- `Entity getEntity(World worldIn)`
- `NBTTagCompound getTagCompound()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.