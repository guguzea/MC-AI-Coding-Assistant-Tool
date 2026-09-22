# C07PacketPlayerDigging

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C07PacketPlayerDigging

## Class signature

```java
public class C07PacketPlayerDigging extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C07PacketPlayerDigging()`
- `C07PacketPlayerDigging(C07PacketPlayerDigging.Action statusIn, BlockPos posIn, EnumFacing facingIn)`

## Methods

- `EnumFacing getFacing()`
- `BlockPos getPosition()`
- `C07PacketPlayerDigging.Action getStatus()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.