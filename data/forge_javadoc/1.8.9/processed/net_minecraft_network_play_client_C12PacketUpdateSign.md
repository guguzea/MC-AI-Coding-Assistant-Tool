# C12PacketUpdateSign

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C12PacketUpdateSign

## Class signature

```java
public class C12PacketUpdateSign extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C12PacketUpdateSign()`
- `C12PacketUpdateSign(BlockPos pos, IChatComponent [] lines)`

## Methods

- `IChatComponent [] getLines()`
- `BlockPos getPosition()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.