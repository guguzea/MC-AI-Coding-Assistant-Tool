# S2FPacketSetSlot

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S2FPacketSetSlot

## Class signature

```java
public class S2FPacketSetSlot extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S2FPacketSetSlot()`
- `S2FPacketSetSlot(int windowIdIn, int slotIn, ItemStack itemIn)`

## Methods

- `int func_149173_d()`
- `ItemStack func_149174_e()`
- `int func_149175_c()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.