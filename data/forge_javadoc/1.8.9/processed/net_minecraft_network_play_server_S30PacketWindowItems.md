# S30PacketWindowItems

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S30PacketWindowItems

## Class signature

```java
public class S30PacketWindowItems extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S30PacketWindowItems()`
- `S30PacketWindowItems(int windowIdIn, java.util.List<ItemStack> p_i45186_2_)`

## Methods

- `int func_148911_c()`
- `ItemStack [] getItemStacks()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.