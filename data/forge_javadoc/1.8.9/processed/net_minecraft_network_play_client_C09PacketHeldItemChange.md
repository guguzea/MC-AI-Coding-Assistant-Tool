# C09PacketHeldItemChange

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C09PacketHeldItemChange

## Class signature

```java
public class C09PacketHeldItemChange extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C09PacketHeldItemChange()`
- `C09PacketHeldItemChange(int slotId)`

## Methods

- `int getSlotId()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.