# S09PacketHeldItemChange

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S09PacketHeldItemChange

## Class signature

```java
public class S09PacketHeldItemChange extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S09PacketHeldItemChange()`
- `S09PacketHeldItemChange(int hotbarIndexIn)`

## Methods

- `int getHeldItemHotbarIndex()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.